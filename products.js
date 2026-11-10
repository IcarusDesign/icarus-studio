// ============================================================
//  CATÁLOGO — edite aqui os seus trabalhos
//  image: ficheiro na pasta /images/art
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
  { slug: "sol-di-praia",    title: "Sol di Praia",    colors: ["#B9B2A6", "#B3141B"] },
  { slug: "status",          title: "Status",          colors: ["#BDBDBD", "#C62828"] },
  { slug: "flor-di-terra",   title: "Flor di Terra",   colors: ["#F57C00", "#FFE0B2"] },
  { slug: "kauboi-kriol",    title: "Kauboi Kriol",    colors: ["#F2D7A7", "#3B2A20"] },
  { slug: "passada",         title: "Passada",         colors: ["#1E4FD8", "#0B1E5B"] },
  { slug: "morabeza",        title: "Morabeza",        colors: ["#E53A1E", "#2E7D32"] },
  { slug: "mundu-na-kabesa", title: "Mundu na Kabesa", colors: ["#FFC107", "#5D4037"] },
  { slug: "ouro",            title: "Ouro",            colors: ["#0F4C45", "#D4A017"] },
  { slug: "skuru",           title: "Skuru",           colors: ["#0B3D33", "#E0E0E0"] },
  { slug: "janela",          title: "Janela",          colors: ["#F9A825", "#6D4C41"] },
  { slug: "kampion",         title: "Kampion",         colors: ["#1E3FA8", "#F9C80E"] },
  { slug: "sabi",            title: "Sabi",            colors: ["#EFE6D2", "#C1440E"] },
  { slug: "badiu",           title: "Badiu",           colors: ["#F4E9DC", "#1E5AA8"] },
  { slug: "raiz",            title: "Raiz",            colors: ["#F7B21B", "#E8620C"] },
  { slug: "noites",          title: "Noites",          colors: ["#F9A825", "#6A2C91"] },
  { slug: "irmandade",       title: "Irmandade",       colors: ["#D6D2CB", "#3A3530"] },
].map((p) => ({ image: `images/art/${p.slug}.webp`, ...p }));
