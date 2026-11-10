// ============================================================
//  CATÁLOGO — edite aqui os seus trabalhos
//  image: ficheiro na pasta /images/art
//  edition: total de cópias da edição limitada
//  left:    cópias que restam (0 = ESGOTADO). Atualize a cada venda!
//  (se a imagem não existir, aparece um placeholder colorido)
// ============================================================
window.SITE = {
  brand: "ICARUS",
  currency: "€",
  whatsapp: "2389893666",          // (+238) 989 36 66
  instagram: "https://instagram.com/icarus_studios7",
  threads: "https://www.threads.net/@icarus_studios7",
  email: "herminiltonmiranda12@gmail.com",
  sizes: [
    { label: "A4 / 21x30 cm", price: 25 },
    { label: "A3 / 30x42 cm", price: 40 },
    { label: "50x70 cm",      price: 65 },
  ],
};

window.PRODUCTS = [
  { slug: "raiz",              title: "Raiz",              edition: 30, left: 19, colors: ["#F7B21B", "#E8620C"] },
  { slug: "kampion",           title: "Kampion",           edition: 30, left: 24, colors: ["#1E3FA8", "#F9C80E"] },
  { slug: "noites",            title: "Noites",            edition: 30, left: 25, colors: ["#F9A825", "#6A2C91"] },
  { slug: "sol-di-praia",      title: "Sol di Praia",      edition: 20, left: 16, colors: ["#B9B2A6", "#B3141B"] },
  { slug: "flor-di-terra",     title: "Flor di Terra",     edition: 20, left: 17, colors: ["#F57C00", "#FFE0B2"] },
  { slug: "kauboi-kriol",      title: "Kauboi Kriol",      edition: 20, left: 19, colors: ["#F2D7A7", "#3B2A20"] },
  { slug: "passada",           title: "Passada",           edition: 15, left: 15, colors: ["#1E4FD8", "#0B1E5B"] },
  { slug: "responsabilidade",  title: "Responsabilidade",  edition: 15, left: 15, colors: ["#E53A1E", "#2E7D32"] },
  { slug: "mundu-na-kabesa",   title: "Mundu na Kabesa",   edition: 15, left: 15, colors: ["#FFC107", "#5D4037"] },
  { slug: "pustura",           title: "Pustura",           edition: 15, left: 15, colors: ["#0F4C45", "#D4A017"] },
  { slug: "sentimento",        title: "Sentimento",        edition: 15, left: 15, colors: ["#0B3D33", "#E0E0E0"] },
  { slug: "janela",            title: "Janela",            edition: 15, left: 15, colors: ["#F9A825", "#6D4C41"] },
  { slug: "sab-boy",           title: "Sab Boy",           edition: 15, left: 15, colors: ["#EFE6D2", "#C1440E"] },
  { slug: "e-22",              title: "E-22",              edition: 15, left: 15, colors: ["#F4E9DC", "#1E5AA8"] },
  { slug: "irmandade",         title: "Irmandade",         edition: 15, left: 15, colors: ["#D6D2CB", "#3A3530"] },
  { slug: "status",            title: "Status",            edition: 15, left: 15, colors: ["#BDBDBD", "#C62828"] },
].map((p) => ({ image: `images/art/${p.slug}.webp`, ...p }));
