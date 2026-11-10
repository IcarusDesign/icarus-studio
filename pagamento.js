// ============================================================
//  PAGAMENTO — preencha entre as aspas "" e guarde o ficheiro.
//  Estes dados aparecem no checkout, cada um com botão "Copiar".
//  Enquanto estiverem vazios, o checkout pede ao cliente para
//  solicitar os dados pelo WhatsApp.
// ============================================================
window.PAYMENT = {
  bank: {
    holder:  "",   // "Herminilton"
    bank:    "",   // "Bcn"
    account: "",   // "7936959"
    nib:     "",   // "0004 0000 07936959101 54"
    iban:    "",   // "CV64 0004 0000 7936 9591 0154"
  },

  // URL da "App da Web" do Google Apps Script (ver LEIA-ME.md, secção
  // "Base de dados de pedidos"). Enquanto estiver vazio, os pedidos
  // NÃO são guardados e o comprovativo só pode ser enviado pelo WhatsApp.
  ordersEndpoint: "",
};
