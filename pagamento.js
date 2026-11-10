// ============================================================
//  PAGAMENTO — preencha entre as aspas "" e guarde o ficheiro.
//  Estes dados aparecem no checkout, cada um com botão "Copiar".
//  Enquanto estiverem vazios, o checkout pede ao cliente para
//  solicitar os dados pelo WhatsApp.
// ============================================================
window.PAYMENT = {
  bank: {
    holder:  "Herminilton",   // Nome do Titular
    bank:    "BCN",   // BANCO
    account: "7936959",   // NUMERO DA CONTA
    nib:     "0004 0000 07936959101 54",   // NIB
    iban:    "CV64 0004 0000 7936 9591 0154",   // IBAN
  },

  // URL da "App da Web" do Google Apps Script (ver LEIA-ME.md, secção
  // "Base de dados de pedidos"). Enquanto estiver vazio, os pedidos
  // NÃO são guardados e o comprovativo só pode ser enviado pelo WhatsApp.
  ordersEndpoint: "https://script.google.com/macros/s/AKfycbwA59xriANGsZpemD0ktj0V8VXdUqyVDi3MVOc0oikUSIAW3ghGpSLaeZgFkKIUoU8/exec",
};
