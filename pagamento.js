// ============================================================
//  PAGAMENTO — preencha entre as aspas "" e guarde o ficheiro.
//  Estes dados aparecem no checkout, cada um com botão "Copiar".
//  Enquanto estiverem vazios, o checkout pede ao cliente para
//  solicitar os dados pelo WhatsApp.
// ============================================================
window.PAYMENT = {
  bank: {
    holder:  "",   // Nome do Titular
    bank:    "",   // Banco
    account: "",   // Número da Conta
    nib:     "",   // NIB
    iban:    "",   // IBAN
  },

  // URL da "App da Web" do Google Apps Script (ver LEIA-ME.md, secção
  // "Base de dados de pedidos"). Enquanto estiver vazio, os pedidos
  // NÃO são guardados e o comprovativo só pode ser enviado pelo WhatsApp.
  ordersEndpoint: "",
};
