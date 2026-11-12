/**
 * ICARUS STUDIOS — Base de dados de pedidos
 * ------------------------------------------------------------
 * Guarda cada pedido do site numa folha de cálculo (Google Sheets)
 * e os comprovativos numa pasta do Google Drive.
 * Envia-te um email a cada pedido novo e a cada comprovativo.
 *
 * Instalação: ver LEIA-ME.md → "Base de dados de pedidos".
 */

const SHEET_NAME = 'Pedidos';
const NEWS_SHEET = 'Newsletter';
const WEAR_SHEET = 'Icarus Wear';
const WEAR_HEADERS = ['Data', 'Email', 'Peça', 'Pedido', 'Tamanho', 'Mensagem', 'Estado'];
const FOLDER_NAME = 'Icarus Studio — Comprovativos'; // nome da pasta já criada no Drive (mudar aqui cria uma pasta nova)
const NOTIFY = true; // false = não enviar emails de aviso
const MAX_FILE_MB = 5;
const HEADERS = [
  'Data', 'Referência', 'Estado', 'Nome', 'Telefone', 'Email', 'Ilha', 'Endereço',
  'Itens', 'Subtotal (CVE)', 'Envio (CVE)', 'Total (CVE)', 'Aceita campanhas', 'Comprovativo',
];
const COL = Object.fromEntries(HEADERS.map((h, i) => [h, i + 1]));

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const d = JSON.parse(e.postData.contents || '{}');
    if (d.website) return json_({ ok: true }); // armadilha anti-spam
    const sh = sheet_();

    if (d.action === 'order') {
      if (!d.ref || !d.name || !d.phone) return json_({ ok: false, error: 'dados em falta' });
      if (!findRow_(sh, d.ref)) addOrder_(sh, d);
      return json_({ ok: true });
    }

    if (d.action === 'proof') {
      let row = findRow_(sh, d.ref);
      if (!row && d.ref && d.name) { addOrder_(sh, d); row = findRow_(sh, d.ref); } // pedido não tinha sido guardado
      if (!row) return json_({ ok: false, error: 'pedido não encontrado' });
      const f = d.file || {};
      if (!/^image\/|^application\/pdf$/.test(f.type || '')) return json_({ ok: false, error: 'tipo de ficheiro' });
      const bytes = Utilities.base64Decode(f.data || '');
      if (bytes.length > MAX_FILE_MB * 1024 * 1024) return json_({ ok: false, error: 'ficheiro grande' });
      const name = `${clean_(d.ref)} — ${String(f.name || 'comprovativo').slice(0, 80)}`;
      const file = folder_().createFile(Utilities.newBlob(bytes, f.type, name));
      sh.getRange(row, COL['Comprovativo']).setValue(file.getUrl());
      sh.getRange(row, COL['Estado']).setValue('Comprovativo recebido');
      notify_(`Comprovativo recebido — ${d.ref}`, `${file.getUrl()}\n\n${sh.getParent().getUrl()}`);
      return json_({ ok: true });
    }

    if (d.action === 'newsletter') {
      const email = String(d.email || '').trim().toLowerCase().slice(0, 200);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json_({ ok: false, error: 'email inválido' });
      const ns = newsSheet_();
      const last = ns.getLastRow();
      const known = last > 1 && ns.getRange(2, 2, last - 1, 1).getValues().some((r) => r[0] === email);
      if (!known) ns.appendRow([new Date(), clean_(email), 'Site']);
      return json_({ ok: true });
    }

    if (d.action === 'wear') {
      const email = String(d.email || '').trim().toLowerCase().slice(0, 200);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json_({ ok: false, error: 'email inválido' });
      const ws = tab_(WEAR_SHEET, WEAR_HEADERS);
      ws.appendRow([new Date(), clean_(email), clean_(d.piece).slice(0, 80), clean_(d.kind).slice(0, 40),
        clean_(d.size).slice(0, 10), clean_(d.message).slice(0, 600), 'Novo']);
      notify_(`Icarus Wear — ${String(d.kind || '').slice(0, 40)}: ${String(d.piece || '').slice(0, 80)}`,
        `${email}\nTamanho: ${d.size || '—'}\n\n${String(d.message || '').slice(0, 600)}\n\n${ws.getParent().getUrl()}`);
      return json_({ ok: true });
    }

    if (d.action === 'status') {
      const row = findRow_(sh, d.ref);
      if (row) sh.getRange(row, COL['Estado']).setValue(clean_(d.status).slice(0, 60));
      return json_({ ok: !!row });
    }

    return json_({ ok: false, error: 'ação desconhecida' });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Abrir o URL no navegador mostra isto (útil para testar se está publicado).
function doGet() {
  return json_({ ok: true, service: 'Icarus Studios — pedidos' });
}

// ---------- utilitários ----------
function addOrder_(sh, d) {
  sh.appendRow([
    new Date(), clean_(d.ref), 'Aguarda pagamento', clean_(d.name), clean_(d.phone),
    clean_(d.email), clean_(d.island), clean_(d.address), clean_(d.items),
    num_(d.subtotal), num_(d.shipping), num_(d.total), d.marketing ? 'Sim' : 'Não', '',
  ]);
  notify_(`Novo pedido ${d.ref} — ${num_(d.total)} CVE`,
    `${d.name} · ${d.phone} · ${d.island}\n${d.address}\n\n${d.items}\n\nTotal: ${num_(d.total)} CVE\n\n${sh.getParent().getUrl()}`);
}

// Execute esta função UMA vez no editor (botão ▶ Executar) para autorizar
// o acesso à folha, ao Drive e ao email antes de publicar.
function autorizar() {
  sheet_();
  newsSheet_();
  tab_(WEAR_SHEET, WEAR_HEADERS);
  folder_();
  MailApp.getRemainingDailyQuota();
  Logger.log('Autorizado. Agora: Implementar → Gerir implementações → ✏️ → Nova versão.');
}

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) {
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  return sh;
}

function newsSheet_() {
  return tab_(NEWS_SHEET, ['Data', 'Email', 'Origem']);
}

// separador com cabeçalho (cria se não existir)
function tab_(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  if (sh.getLastRow() === 0) {
    sh.appendRow(headers);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }
  return sh;
}

function folder_() {
  const it = DriveApp.getFoldersByName(FOLDER_NAME);
  return it.hasNext() ? it.next() : DriveApp.createFolder(FOLDER_NAME);
}

function findRow_(sh, ref) {
  const refs = sh.getRange(1, COL['Referência'], sh.getLastRow(), 1).getValues();
  for (let i = refs.length - 1; i >= 1; i--) if (refs[i][0] === ref) return i + 1;
  return 0;
}

// Texto seguro para a folha: corta o tamanho e impede fórmulas (=, +, -, @).
function clean_(v) {
  const s = String(v == null ? '' : v).slice(0, 1000);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function num_(v) {
  const n = Number(v);
  return isFinite(n) ? Math.round(n * 100) / 100 : 0;
}

function notify_(subject, body) {
  if (!NOTIFY) return;
  try { MailApp.sendEmail(Session.getEffectiveUser().getEmail(), '[Icarus] ' + subject, body); } catch (e) {}
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
