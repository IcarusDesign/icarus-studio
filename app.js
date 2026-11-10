(() => {
  const S = window.SITE;
  const P = window.PRODUCTS;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const main = $("#main");
  const fmt = (n) => `${S.currency}${n.toFixed(2).replace(".", ",")}`;
  const minPrice = Math.min(...S.sizes.map((s) => s.price));
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // ---------- storage (falha silenciosa) ----------
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  };

  // ---------- arte (imagem real ou placeholder) ----------
  function art(p) {
    const ph = `<div class="ph" style="background:linear-gradient(150deg,${p.colors[0]},${p.colors[1]})">${esc(p.title)}</div>`;
    return `<img src="${p.image}" alt="${esc(p.title)}" loading="lazy" onerror="this.outerHTML=this.nextElementSibling.innerHTML"><template>${ph}</template>`;
  }
  const print = (p) => `<div class="print">${art(p)}</div>`;

  const card = (p) => `
    <a class="card reveal" href="#/p/${p.slug}">
      <div class="card__frame">${print(p)}</div>
      <h3 class="card__title">${esc(p.title)}</h3>
      <p class="card__price">Desde ${fmt(minPrice)}</p>
    </a>`;

  // ---------- views ----------
  function viewHome() {
    document.title = "ICARUS STUDIO";
    main.innerHTML = `<h1 class="sr-only">Icarus Studio — Prints de arte</h1>
      <section class="grid">${P.map(card).join("")}</section>`;
  }

  function viewProduct(slug) {
    const p = P.find((x) => x.slug === slug);
    if (!p) return viewHome();
    document.title = `${p.title} | ICARUS STUDIO`;
    let sel = 0;
    const others = P.filter((x) => x !== p).slice(0, 3);
    main.innerHTML = `
      <section class="product">
        <div class="product__media">${print(p)}</div>
        <div class="product__info">
          <div class="product__block">
            <nav class="crumbs" aria-label="Navegação"><a href="#/">Início</a><span>/</span><a href="#/">Coleção</a><span>/</span><span>${esc(p.title)}</span></nav>
            <h1 class="product__title">${esc(p.title)}</h1>
            <p class="product__ship">Portes não incluídos, segundo a tarifa dos Correios. <a href="#/envios">Envio</a></p>
            <p class="product__price" data-price>${fmt(S.sizes[0].price)}</p>
            <p class="label">Escolhe o tamanho</p>
            <div class="sizes" role="group" aria-label="Tamanho">
              ${S.sizes.map((s, i) => `<button type="button" class="size" data-size="${i}" aria-pressed="${i === 0}">${s.label}</button>`).join("")}
            </div>
          </div>
          <div class="product__block">
            <button class="btn-black" type="button" data-add>Adicionar ao carrinho — ${fmt(S.sizes[0].price)}</button>
            <div class="acc">
              <details><summary>Papel</summary><p>Papel de arte mate de 300 g/m², com textura suave e cores ricas e duradouras.</p></details>
              <details><summary>Detalhes</summary><p>Edição aberta — sem limite de quantidade, mas impressa com o mesmo cuidado. Cada print leva a assinatura digital do artista integrada na obra.</p></details>
              <details><summary>Nota</summary><p>Cada print inclui uma margem branca (2–4 cm consoante o tamanho), já incluída nas medidas totais. Facilita o manuseamento e a moldura sem cortar a arte.</p></details>
              <details><summary>Envio</summary><p>Enviamos para todas as ilhas de Cabo Verde. O custo de envio não está incluído no preço: depende da tarifa dos Correios e é confirmado contigo pelo WhatsApp antes do pagamento.</p></details>
              <details><summary>Devoluções</summary><p>Cada print é feito por encomenda, por isso todas as vendas são finais e não há reembolsos. Ver <a href="#/reembolso">Política de Reembolso</a>.</p></details>
            </div>
          </div>
        </div>
      </section>
      <section class="related">
        <h2>Também vais gostar</h2>
        <div class="grid">${others.map(card).join("")}</div>
      </section>`;

    $$(".size", main).forEach((b) => b.addEventListener("click", () => {
      sel = +b.dataset.size;
      $$(".size", main).forEach((x) => x.setAttribute("aria-pressed", x === b));
      $("[data-price]", main).textContent = fmt(S.sizes[sel].price);
      $("[data-add]", main).textContent = `Adicionar ao carrinho — ${fmt(S.sizes[sel].price)}`;
    }));
    $("[data-add]", main).addEventListener("click", () => { addToCart(p.slug, sel); openCart(); });
  }

  function viewAbout() {
    document.title = "Sobre | ICARUS STUDIO";
    main.innerHTML = `
      <div class="page-head"><nav class="crumbs"><a href="#/">Início</a><span>/</span><span>Sobre</span></nav><h1>Sobre</h1></div>
      <section class="about">
        <div class="about__text">
          <p>Somos a Icarus Studio, um estúdio de branding e ilustração digital nascido na Praia, Cabo Verde.</p>
          <p>O nosso trabalho junta retrato, cor e cultura: rostos construídos em planos de cor, texturas quentes e referências que reconheces — da música kriola ao desporto, da rua às capas de festival. Cada peça celebra a identidade cabo-verdiana e africana com uma linguagem gráfica contemporânea.</p>
          <p>Essas obras não ficam só no ecrã. Ganham vida como prints — feitos para viver numa parede, com qualidade à altura da arte. É aqui que uma imagem deixa de ser só uma imagem e passa a ser algo teu.</p>
          <p>Tudo sai nos nossos termos: drops limitados, edições abertas e trabalhos por encomenda, enviados para todas as ilhas de Cabo Verde.</p>
          <h2>Serviços</h2>
          <ul class="services">
            <li><span>Branding & Identidade Visual</span><span>01</span></li>
            <li><span>Ilustração Digital</span><span>02</span></li>
            <li><span>Retratos por encomenda</span><span>03</span></li>
            <li><span>Cartazes & Capas</span><span>04</span></li>
          </ul>
          <p>Tens um projeto? Fala connosco.</p>
          <a class="btn-line" data-link="whatsapp" target="_blank" rel="noopener">Pedir orçamento</a>
        </div>
        <div class="about__media">
          <img src="images/about.jpg" alt="Icarus Studio" onerror="this.outerHTML=this.nextElementSibling.innerHTML"><template><img class="big-mark" src="images/logo-wings.webp" alt="Logo Icarus"></template>
        </div>
      </section>`;
  }

  // ---------- políticas ----------
  const mail = () => `<a href="mailto:${S.email}">${S.email}</a>`;
  const wa = () => `<a data-link="whatsapp" target="_blank" rel="noopener">WhatsApp (+238) 989 36 66</a>`;
  const POLICIES = {
    termos: {
      title: "Termos de Serviço",
      body: () => `
        <p>Ao usar este site e fazer uma encomenda à Icarus Studio, aceitas os termos abaixo.</p>
        <h2>1. Sobre nós</h2>
        <p>A Icarus Studio é um estúdio de branding e ilustração digital sediado na Praia, Cabo Verde. Contacto: ${mail()} · ${wa()}.</p>
        <h2>2. Encomendas</h2>
        <p>As encomendas são feitas através do carrinho do site e confirmadas por WhatsApp. Uma encomenda só fica confirmada depois de acordarmos contigo o valor total (print + envio) e de recebermos o pagamento.</p>
        <h2>3. Preços</h2>
        <p>Os preços apresentados no site referem-se apenas ao print. O custo de envio não está incluído e é calculado à parte (ver <a href="#/envios">Política de Envio</a>). Podemos alterar preços a qualquer momento, sem afetar encomendas já confirmadas.</p>
        <h2>4. Produção</h2>
        <p>Cada print é impresso por encomenda. Pequenas diferenças de cor entre o ecrã e o papel são normais e não são consideradas defeito.</p>
        <h2>5. Direitos de autor</h2>
        <p>Todas as artes, ilustrações e marcas apresentadas neste site são propriedade da Icarus Studio. A compra de um print dá-te direito a uso pessoal da peça física. Não é permitido reproduzir, digitalizar, revender ou usar as imagens para fins comerciais sem autorização escrita.</p>
        <h2>6. Trabalhos por encomenda</h2>
        <p>Projetos de branding, ilustração e retratos personalizados têm orçamento, prazos e condições próprias, acordadas caso a caso antes do início do trabalho.</p>
        <h2>7. Alterações</h2>
        <p>Podemos atualizar estes termos. A versão em vigor é sempre a publicada nesta página.</p>`,
    },
    reembolso: {
      title: "Política de Reembolso",
      body: () => `
        <div class="policy__callout">Todas as vendas são finais. Não aceitamos devoluções nem fazemos reembolsos.</div>
        <p>Cada print é produzido especialmente para ti depois da encomenda, por isso não é possível devolver, trocar ou cancelar uma encomenda depois de confirmada e paga.</p>
        <h2>Print danificado ou com erro</h2>
        <p>Se o teu print chegar danificado ou com um erro de impressão da nossa parte, contacta-nos até 48 horas depois de o receberes, com fotos da embalagem e do print, por ${wa()} ou ${mail()}. Nesses casos, analisamos a situação e podemos reimprimir o print, sem que isso constitua um reembolso.</p>
        <h2>Antes de encomendar</h2>
        <p>Confirma com atenção a arte, o tamanho e a morada de entrega antes de finalizar. Em caso de dúvida, fala connosco antes de pagar.</p>`,
    },
    envios: {
      title: "Política de Envio",
      body: () => `
        <p>Enviamos para todas as ilhas de Cabo Verde, a partir da Praia.</p>
        <div class="policy__callout">O custo de envio não está incluído nos preços apresentados no site. O valor depende da tarifa dos Correios para o teu destino, tamanho e peso da encomenda.</div>
        <h2>Como funciona</h2>
        <ul>
          <li>Finalizas o pedido no carrinho, que abre o WhatsApp com a tua encomenda.</li>
          <li>Confirmamos contigo o custo de envio segundo a tarifa dos Correios e o valor total.</li>
          <li>Depois do pagamento, o print é produzido e enviado.</li>
        </ul>
        <h2>Prazos</h2>
        <p>A produção demora normalmente 3 a 5 dias úteis. O prazo de entrega depende dos Correios e da ilha de destino.</p>
        <h2>Embalagem</h2>
        <p>Os prints são enviados protegidos, em tubo rígido ou envelope reforçado, para chegarem em perfeitas condições.</p>
        <h2>Morada e responsabilidade</h2>
        <p>Garante que a morada indicada está completa e correta. Não nos responsabilizamos por atrasos ou extravios causados pelos Correios ou por moradas incorretas.</p>`,
    },
    privacidade: {
      title: "Política de Privacidade",
      body: () => `
        <p>A tua privacidade é importante para nós. Esta política explica que dados recolhemos e como os usamos.</p>
        <h2>Dados que recolhemos</h2>
        <ul>
          <li><strong>Encomendas:</strong> nome, contacto e morada que nos envias pelo WhatsApp para processar e entregar a encomenda.</li>
          <li><strong>Newsletter:</strong> o email que nos deixas, se subscreveres.</li>
          <li><strong>No teu dispositivo:</strong> o site guarda localmente o conteúdo do carrinho e a tua escolha sobre cookies. Estes dados ficam no teu navegador e não são enviados para nós.</li>
        </ul>
        <h2>Como usamos os dados</h2>
        <p>Usamos os teus dados apenas para tratar das encomendas, responder a mensagens e, se subscreveres, enviar novidades da Icarus Studio. Não vendemos nem partilhamos os teus dados com terceiros, exceto o necessário para a entrega (por exemplo, os Correios).</p>
        <h2>Serviços de terceiros</h2>
        <p>As encomendas são tratadas pelo WhatsApp, que tem a sua própria política de privacidade. O site é alojado no GitHub Pages e usa tipos de letra do Google Fonts.</p>
        <h2>Os teus direitos</h2>
        <p>Podes pedir para ver, corrigir ou apagar os teus dados, ou cancelar a newsletter, a qualquer momento através de ${mail()}.</p>`,
    },
  };

  function viewPolicy(key) {
    const p = POLICIES[key];
    document.title = `${p.title} | ICARUS STUDIO`;
    main.innerHTML = `
      <div class="page-head"><nav class="crumbs"><a href="#/">Início</a><span>/</span><span>${p.title}</span></nav><h1>${p.title}</h1></div>
      <article class="policy">${p.body()}<p class="policy__updated">Última atualização: novembro de 2026</p></article>`;
  }

  // ---------- router ----------
  function route() {
    const h = location.hash.replace(/^#\/?/, "");
    const [a, b] = h.split("/");
    if (a === "p") viewProduct(b);
    else if (a === "about") viewAbout();
    else if (POLICIES[a]) viewPolicy(a);
    else viewHome();
    $$("[data-nav]").forEach((n) => n.classList.toggle("is-active", (n.dataset.nav === "about") === (a === "about") && (a === "about" || !a)));
    bindLinks();
    observe();
    closeCart();
    window.scrollTo(0, 0);
  }

  // ---------- reveal ----------
  const io = "IntersectionObserver" in window
    ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" })
    : null;
  function observe() {
    $$(".reveal:not(.is-in)").forEach((el, i) => {
      el.style.transitionDelay = `${(i % 3) * 80}ms`;
      io ? io.observe(el) : el.classList.add("is-in");
    });
  }

  // ---------- links externos ----------
  function bindLinks() {
    const links = { instagram: S.instagram, threads: S.threads, email: `mailto:${S.email}`, whatsapp: `https://wa.me/${S.whatsapp}?text=${encodeURIComponent("Olá Icarus Studio! Gostava de pedir um orçamento.")}` };
    $$("[data-link]").forEach((a) => { a.href = links[a.dataset.link]; });
  }

  // ---------- carrinho ----------
  let cart = store.get("icarus-cart", []).filter((x) => P.some((p) => p.slug === x.slug) && S.sizes[x.size]);
  const drawer = $(".drawer"), bg = $(".drawer-bg");
  function saveCart() { store.set("icarus-cart", cart); renderCart(); }
  function addToCart(slug, size) {
    const it = cart.find((x) => x.slug === slug && x.size === size);
    it ? it.qty++ : cart.push({ slug, size, qty: 1 });
    saveCart();
  }
  function renderCart() {
    const n = cart.reduce((s, x) => s + x.qty, 0);
    $("[data-cart-count]").textContent = n;
    const box = $("[data-cart-items]");
    if (!cart.length) { box.innerHTML = `<p class="drawer__empty">O teu carrinho está vazio.</p>`; }
    else box.innerHTML = cart.map((x, i) => {
      const p = P.find((q) => q.slug === x.slug); if (!p) return "";
      const s = S.sizes[x.size];
      return `<div class="line">${print(p)}<div><h3>${esc(p.title)}</h3><small>${s.label}</small>
        <div class="qty"><button type="button" data-q="${i}" data-d="-1" aria-label="Menos">−</button><span>${x.qty}</span><button type="button" data-q="${i}" data-d="1" aria-label="Mais">+</button></div></div>
        <div><div class="line__price">${fmt(s.price * x.qty)}</div><button type="button" class="line__remove" data-rm="${i}">Remover</button></div></div>`;
    }).join("");
    $("[data-cart-total]").textContent = fmt(cart.reduce((s, x) => s + S.sizes[x.size].price * x.qty, 0));
    $("[data-checkout]").disabled = !cart.length;
    $("[data-checkout]").style.opacity = cart.length ? 1 : .4;
  }
  function openCart() { drawer.classList.add("is-open"); drawer.setAttribute("aria-hidden", "false"); bg.hidden = false; }
  function closeCart() { drawer.classList.remove("is-open"); drawer.setAttribute("aria-hidden", "true"); bg.hidden = true; }
  $$("[data-open-cart]").forEach((b) => b.addEventListener("click", openCart));
  $$("[data-close-cart]").forEach((b) => b.addEventListener("click", closeCart));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeCart(); });
  $("[data-cart-items]").addEventListener("click", (e) => {
    const q = e.target.closest("[data-q]"), r = e.target.closest("[data-rm]");
    if (q) { const it = cart[+q.dataset.q]; it.qty += +q.dataset.d; if (it.qty < 1) cart.splice(+q.dataset.q, 1); saveCart(); }
    if (r) { cart.splice(+r.dataset.rm, 1); saveCart(); }
  });
  $("[data-checkout]").addEventListener("click", () => {
    if (!cart.length) return;
    const lines = cart.map((x) => { const p = P.find((q) => q.slug === x.slug); const s = S.sizes[x.size]; return `• ${x.qty}x ${p.title} (${s.label}) — ${fmt(s.price * x.qty)}`; });
    const total = fmt(cart.reduce((s, x) => s + S.sizes[x.size].price * x.qty, 0));
    const msg = `Olá Icarus Studio! Quero encomendar:\n${lines.join("\n")}\n\nTotal: ${total}`;
    window.open(`https://wa.me/${S.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
  });

  // ---------- newsletter ----------
  $("[data-news]").addEventListener("submit", (e) => {
    e.preventDefault();
    e.target.reset();
    $("[data-news-msg]").textContent = "Obrigado! Vais receber as novidades em primeira mão.";
  });

  // ---------- selo ----------
  const badge = $("[data-badge]");
  if (store.get("icarus-badge-off", false)) badge.remove();
  else $("[data-badge-close]").addEventListener("click", () => { badge.remove(); store.set("icarus-badge-off", true); });

  // ---------- cookies ----------
  const ck = $("[data-cookies]");
  if (store.get("icarus-cookies", null) === null) ck.hidden = false;
  $$("[data-cookie]").forEach((b) => b.addEventListener("click", () => { store.set("icarus-cookies", b.dataset.cookie === "1"); ck.hidden = true; }));

  // ---------- menu mobile ----------
  const mn = document.createElement("nav");
  mn.className = "mobile-nav"; mn.setAttribute("aria-label", "Menu");
  mn.innerHTML = `<a href="#/">Início</a><a href="#/about">Sobre</a>`;
  $(".header").after(mn);

  $("[data-year]").textContent = new Date().getFullYear();
  window.addEventListener("hashchange", route);
  renderCart();
  route();
})();
