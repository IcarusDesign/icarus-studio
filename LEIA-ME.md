# Icarus Studio — Site

Site publicado: https://icarusdesign.github.io/icarus-studio/

## Como editar
- **products.js** → artes (título, edição, cópias restantes), tamanhos/preços, envio (€3), prazo (7 dias), WhatsApp, telefone e redes.
- **pagamento.js** → dados bancários do checkout e o link da base de dados.
- **images/** → as artes ficam em `images/art/<slug>.webp` (os originais ficam em `Artes/`, fora do GitHub).
  `images/about.jpg` = foto da página Sobre.
- **app.js** → textos das páginas (Sobre, políticas, checkout).
- **styles.css** → cores (`--bg`, `--accent`) e tipografia.

## Publicar uma alteração
No Terminal, dentro da pasta `Website`:

```bash
git add -A && git commit -m "Atualiza site" && git push
```

O site atualiza em ~1 minuto.

---

## Dados bancários (pagamento.js)
Abra `pagamento.js` e cole cada dado entre as aspas:

```js
holder:  "…",   // Nome do Titular
bank:    "…",   // Banco
account: "…",   // Número da Conta
nib:     "…",   // NIB
iban:    "…",   // IBAN
```

Guarde e publique (comando acima). Enquanto algum campo estiver vazio, o checkout
mostra um botão para o cliente pedir os dados pelo WhatsApp.

---

## Base de dados de pedidos (Google Sheets) — ~10 minutos, grátis
Cada pedido fica numa linha da folha de cálculo: nome, telefone, email, ilha,
endereço, itens, total, se aceita campanhas e o link do comprovativo.
Os comprovativos ficam numa pasta do Google Drive. Recebe um email a cada pedido.

1. Em https://sheets.google.com crie uma folha nova chamada **Icarus — Pedidos**.
2. Menu **Extensões → Apps Script**.
3. Apague o código que aparece e cole todo o conteúdo de
   `google-apps-script/Code.gs`. Clique em **Guardar** (ícone de disquete).
4. Clique em **Implementar → Nova implementação**.
   - Tipo (ícone ⚙️): **App da Web**
   - Executar como: **Eu**
   - Quem tem acesso: **Qualquer pessoa**
   - Clique em **Implementar** e autorize com a sua conta Google
     (em "Google não verificou esta app": *Avançadas → Aceder a … (não seguro)* —
     é normal, a app é sua).
5. Copie o **URL da app da Web** (termina em `/exec`).
6. Em `pagamento.js`, cole-o em `ordersEndpoint: "…"`, guarde e publique.

Teste: faça um pedido no site e veja a linha nova aparecer na folha.

**Campanhas:** filtre a coluna *Aceita campanhas = Sim* para ter a lista de
contactos que autorizaram receber novidades. Só envie campanhas a essas pessoas.

**Se alterar o Code.gs depois:** Implementar → Gerir implementações → ✏️ →
Versão: *Nova versão* → Implementar (o URL mantém-se).

---

## Stock (cópias restantes)
O número **não desce sozinho**. A cada venda confirmada, baixe o `left` da arte em
`products.js` e publique. `left: 0` = ESGOTADO.
