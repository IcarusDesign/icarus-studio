(() => {
  const S = window.SITE;
  const P = window.PRODUCTS;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const main = $("#main");
  // escudos: sem casas decimais, ponto nos milhares → "2.750 CVE"
  const num = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const fmt = (n) => `${num(n)} ${S.currency}`;
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

  // ---------- edição limitada ----------
  const soldOut = (p) => p.edition && p.left <= 0;
  const SIGN = `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 17c3-1 4-6 6-6s0 5 2 5 3-4 5-4 2 3 5 3"/><path d="M3 21h18"/></svg>`;
  const tags = (p) => !p.edition ? "" : `
    <div class="tags">
      ${soldOut(p)
        ? `<span class="tag tag--out">Esgotado</span>`
        : `<span class="tag tag--count" title="Restam ${p.left} de ${p.edition} cópias">Restam ${p.left}/${p.edition}</span>`}
      <span class="tag">${SIGN}Autografado</span>
    </div>`;

  const card = (p) => `
    <a class="card reveal${soldOut(p) ? " is-out" : ""}" href="#/p/${p.slug}">
      <div class="card__frame">${print(p)}</div>
      <h3 class="card__title">${esc(p.title)}</h3>
      <p class="card__price">Desde ${fmt(minPrice)}</p>
      ${tags(p)}
    </a>`;

  // ---------- views ----------
  function viewHome() {
    document.title = "ICARUS STUDIOS";
    main.innerHTML = `<h1 class="sr-only">Icarus Studios — Prints de arte</h1>
      <section class="grid">${P.map(card).join("")}</section>`;
  }

  function viewProduct(slug) {
    const p = P.find((x) => x.slug === slug);
    if (!p) return viewHome();
    document.title = `${p.title} | ICARUS STUDIOS`;
    let sel = 0;
    const others = P.filter((x) => x !== p).slice(0, 3);
    main.innerHTML = `
      <section class="product">
        <div class="product__media">
          <div class="product__stage">${print(p)}</div>
          <figure class="product__mockup"><img src="images/mockups/${p.slug}.webp" alt="${esc(p.title)} — mockup numa parede" loading="lazy" onerror="this.parentNode.remove()"></figure>
        </div>
        <div class="product__info">
          <div class="product__block">
            <nav class="crumbs" aria-label="Navegação"><a href="#/">Início</a><span>/</span><a href="#/">Coleção</a><span>/</span><span>${esc(p.title)}</span></nav>
            <h1 class="product__title">${esc(p.title)}</h1>
            ${p.edition ? `
            <div class="edition">
              ${tags(p)}
              <p class="edition__text">Edição limitada de <strong>${p.edition} cópias</strong>, autografadas pelo autor. ${soldOut(p) ? "Esta edição está esgotada." : `Restam apenas <strong>${p.left}</strong>.`}</p>
              <div class="edition__bar" role="img" aria-label="Restam ${Math.max(p.left, 0)} de ${p.edition} cópias"><span style="width:${Math.max(0, Math.min(100, (p.left / p.edition) * 100))}%"></span></div>
            </div>` : ""}
            <p class="product__ship"><a href="#/envios">Envio</a> de ${fmt(S.shipping)} para todas as ilhas · Entrega em até ${S.deliveryDays} dias.</p>
            <p class="product__price" data-price>${fmt(S.sizes[0].price)}</p>
            <p class="label">Escolhe o tamanho</p>
            <div class="sizes" role="group" aria-label="Tamanho">
              ${S.sizes.map((s, i) => `<button type="button" class="size" data-size="${i}" aria-pressed="${i === 0}">${s.label}</button>`).join("")}
            </div>
          </div>
          <div class="product__block">
            <button class="btn-black" type="button" data-add ${soldOut(p) ? "disabled" : ""}>${soldOut(p) ? "Esgotado" : `Adicionar ao carrinho — ${fmt(S.sizes[0].price)}`}</button>
            <div class="acc">
              <details><summary>Papel</summary><p>Papel de arte mate de 300 g/m², com textura suave e cores ricas e duradouras.</p></details>
              <details><summary>Detalhes</summary><p>${p.edition ? `Edição limitada de ${p.edition} cópias. Cada print é autografado pelo autor. Quando a edição esgota, esta arte não volta a ser impressa neste formato.` : "Cada print é autografado pelo autor."}</p></details>
              <details><summary>Nota</summary><p>Cada print inclui uma margem branca (2–4 cm consoante o tamanho), já incluída nas medidas totais. Facilita o manuseamento e a moldura sem cortar a arte.</p></details>
              <details><summary>Envio</summary><p>Enviamos para todas as ilhas de Cabo Verde por um valor fixo de ${fmt(S.shipping)}, somado no checkout. Entrega em até ${S.deliveryDays} dias após a confirmação do pagamento.</p></details>
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
      if (!soldOut(p)) $("[data-add]", main).textContent = `Adicionar ao carrinho — ${fmt(S.sizes[sel].price)}`;
    }));
    $("[data-add]", main).addEventListener("click", () => { if (addToCart(p.slug, sel)) openCart(); });
  }

  function viewAbout() {
    document.title = "Sobre | ICARUS STUDIOS";
    main.innerHTML = `
      <div class="page-head"><nav class="crumbs"><a href="#/">Início</a><span>/</span><span>Sobre</span></nav><h1>Sobre</h1></div>
      <section class="about">
        <div class="about__text">
          <p>Somos a Icarus Studios, um estúdio de branding e ilustração digital nascido na Praia, Cabo Verde.</p>
          <p>O nosso trabalho junta retrato, cor e cultura: rostos construídos em planos de cor, texturas quentes e referências que reconheces — da música kriola ao desporto, da rua às capas de festival. Cada peça celebra a identidade cabo-verdiana e africana com uma linguagem gráfica contemporânea.</p>
          <p>Essas obras não ficam só no ecrã. Ganham vida como prints — feitos para viver numa parede, com qualidade à altura da arte. É aqui que uma imagem deixa de ser só uma imagem e passa a ser algo teu.</p>
          <p>Tudo sai nos nossos termos: edições limitadas e autografadas pelo autor, e trabalhos por encomenda, enviados para todas as ilhas de Cabo Verde.</p>
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
          <img src="images/about.jpg" alt="Icarus Studios" onerror="this.outerHTML=this.nextElementSibling.innerHTML"><template><img class="big-mark" src="images/logo-wings.webp" alt="Logo Icarus"></template>
        </div>
      </section>`;
  }

  // ---------- políticas ----------
  const mail = () => `<a href="mailto:${S.email}">${S.email}</a>`;
  const wa = () => `<a data-link="whatsapp" target="_blank" rel="noopener">WhatsApp</a>`;
  const POLICIES = {
    termos: {
      title: "Termos de Serviço",
      body: () => `
        <p>Ao usar este site e fazer uma encomenda à Icarus Studios, aceitas os termos abaixo.</p>
        <h2>1. Sobre nós</h2>
        <p>A Icarus Studios é um estúdio de branding e ilustração digital sediado na Praia, Cabo Verde. Contacto: ${mail()} · ${wa()}.</p>
        <h2>2. Encomendas</h2>
        <p>As encomendas são feitas no checkout do site. O pagamento é feito por transferência bancária e a encomenda só fica confirmada depois de recebermos o comprovativo (carregado no site ou enviado pelo WhatsApp) e de confirmarmos o pagamento.</p>
        <h2>3. Preços</h2>
        <p>Os preços apresentados no site referem-se ao print. O envio custa ${fmt(S.shipping)} para qualquer ilha de Cabo Verde e é somado no checkout (ver <a href="#/envios">Política de Envio</a>). Podemos alterar preços a qualquer momento, sem afetar encomendas já confirmadas.</p>
        <h2>4. Produção</h2>
        <p>Cada print é impresso por encomenda. Pequenas diferenças de cor entre o ecrã e o papel são normais e não são consideradas defeito.</p>
        <h2>5. Direitos de autor</h2>
        <p>Todas as artes, ilustrações e marcas apresentadas neste site são propriedade da Icarus Studios. A compra de um print dá-te direito a uso pessoal da peça física. Não é permitido reproduzir, digitalizar, revender ou usar as imagens para fins comerciais sem autorização escrita.</p>
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
        <div class="policy__callout">Envio a preço fixo de ${fmt(S.shipping)} para qualquer ilha. Entrega em até ${S.deliveryDays} dias após a confirmação do pagamento.</div>
        <h2>Como funciona</h2>
        <ul>
          <li>No checkout indicas o teu nome, telefone, ilha e endereço de entrega.</li>
          <li>Fazes a transferência do total (prints + ${fmt(S.shipping)} de envio) e envias o comprovativo, no site ou pelo WhatsApp.</li>
          <li>Depois de confirmarmos o pagamento, o teu print autografado é preparado e enviado.</li>
        </ul>
        <h2>Prazos</h2>
        <p>A entrega é feita em até ${S.deliveryDays} dias após a confirmação do pagamento. Em casos excecionais (feriados, mau tempo ou atrasos nos transportes entre ilhas) o prazo pode ser maior; nesse caso avisamos-te.</p>
        <h2>Embalagem</h2>
        <p>Os prints são enviados protegidos, em tubo rígido ou envelope reforçado, para chegarem em perfeitas condições.</p>
        <h2>Morada e responsabilidade</h2>
        <p>Garante que o endereço indicado está completo e correto. Não nos responsabilizamos por atrasos ou extravios causados pela transportadora ou por endereços incorretos.</p>`,
    },
    privacidade: {
      title: "Política de Privacidade",
      body: () => `
        <p>A tua privacidade é importante para nós. Esta política explica que dados recolhemos e como os usamos.</p>
        <h2>Dados que recolhemos</h2>
        <ul>
          <li><strong>Checkout:</strong> nome, telefone, email (opcional), ilha e endereço de entrega, os artigos encomendados e o comprovativo de transferência que carregares.</li>
          <li><strong>Campanhas:</strong> se marcares a opção no checkout, guardamos que aceitas receber novidades e campanhas.</li>
          <li><strong>Newsletter:</strong> o email que nos deixas, se subscreveres.</li>
          <li><strong>No teu dispositivo:</strong> o site guarda localmente o carrinho, os dados do formulário (para não teres de os escrever outra vez) e a tua escolha sobre cookies. Estes dados ficam no teu navegador.</li>
        </ul>
        <h2>Como usamos os dados</h2>
        <p>Usamos os teus dados para tratar e entregar as encomendas, confirmar pagamentos e responder a mensagens. Só te enviamos campanhas e novidades se tiveres dado autorização no checkout ou na newsletter. Não vendemos nem partilhamos os teus dados com terceiros, exceto o necessário para a entrega.</p>
        <h2>Onde ficam guardados</h2>
        <p>Os pedidos e comprovativos são guardados numa conta Google gerida pela Icarus Studios. Os comprovativos servem apenas para confirmar o pagamento.</p>
        <h2>Serviços de terceiros</h2>
        <p>O contacto pode ser feito pelo WhatsApp, que tem a sua própria política de privacidade. O site é alojado no GitHub Pages e usa tipos de letra do Google Fonts.</p>
        <h2>Os teus direitos</h2>
        <p>Podes pedir para ver, corrigir ou apagar os teus dados, ou deixar de receber campanhas, a qualquer momento através de ${mail()} ou ${wa()}.</p>`,
    },
  };

  function viewPolicy(key) {
    const p = POLICIES[key];
    document.title = `${p.title} | ICARUS STUDIOS`;
    main.innerHTML = `
      <div class="page-head"><nav class="crumbs"><a href="#/">Início</a><span>/</span><span>${p.title}</span></nav><h1>${p.title}</h1></div>
      <article class="policy">${p.body()}<p class="policy__updated">Última atualização: novembro de 2026</p></article>`;
  }

  // ============================================================
  //  CHECKOUT  (1 dados → 2 pagamento + comprovativo → 3 concluído)
  // ============================================================
  const PAY = window.PAYMENT || { bank: {}, ordersEndpoint: "" };
  const BANK_FIELDS = [["holder", "Titular"], ["bank", "Banco"], ["account", "Nº da Conta"], ["nib", "NIB"], ["iban", "IBAN"]];
  const bankReady = () => BANK_FIELDS.every(([k]) => String(PAY.bank?.[k] || "").trim());
  const hasDB = () => /^https?:\/\//.test(PAY.ordersEndpoint || "");
  const subtotal = () => cart.reduce((s, x) => s + S.sizes[x.size].price * x.qty, 0);
  const cartSig = () => JSON.stringify(cart.map((x) => [x.slug, x.size, x.qty]));
  const itemsText = (items) => items.map((x) => `${x.qty}x ${x.title} (${x.size}) — ${fmt(x.total)}`).join("\n");
  // referência fácil de escrever no descritivo da transferência: PRIMEIRO NOME + 3 dígitos → "MARIA-482"
  const newRef = (name) => {
    const first = String(name || "").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Za-z]/g, " ").trim().split(/\s+/)[0] || "ICARUS";
    return `${first.toUpperCase().slice(0, 10)}-${100 + Math.floor(Math.random() * 900)}`;
  };
  const waLink = (msg) => `https://wa.me/${S.whatsapp}?text=${encodeURIComponent(msg)}`;
  const ICON = {
    copy: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="1"/><path d="M5 15V5a1 1 0 0 1 1-1h9"/></svg>`,
    phone: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>`,
    wa: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 1c-1-.5-2-1.5-2.5-2.5l1-1-1-2z"/></svg>`,
  };

  // envia para a base de dados (Google Apps Script). Nunca bloqueia o cliente.
  async function sendDB(payload) {
    if (!hasDB()) return { ok: false, skipped: true };
    try {
      const r = await fetch(PAY.ordersEndpoint, { method: "POST", body: JSON.stringify(payload) });
      const txt = await r.text();
      try { return JSON.parse(txt); }
      catch { // o Google devolveu uma página de erro em vez de JSON (script mal publicado)
        const m = txt.match(/Função de script não encontrada: \w+|Script function not found: \w+/);
        console.warn("Base de dados: resposta inválida.", m ? m[0] : txt.slice(0, 200));
        return { ok: false, error: "servidor" };
      }
    } catch (err) {
      // sem internet → "rede"; com internet, o erro vem do servidor (ex.: script do Google mal publicado → bloqueio CORS)
      console.warn("Base de dados indisponível:", err);
      return { ok: false, error: navigator.onLine === false ? "rede" : "servidor" };
    }
  }
  // dados do pedido enviados junto com o comprovativo (cria a linha se o pedido ainda não existir)
  const orderPayload = (o) => ({
    ref: o.ref, ...o.customer, items: itemsText(o.items), subtotal: o.subtotal, shipping: o.shipping, total: o.total,
  });

  async function copyText(text, btn) {
    try { await navigator.clipboard.writeText(text); }
    catch {
      const ta = Object.assign(document.createElement("textarea"), { value: text });
      ta.style.cssText = "position:fixed;opacity:0"; document.body.append(ta); ta.select();
      try { document.execCommand("copy"); } catch {}
      ta.remove();
    }
    const old = btn.innerHTML;
    btn.classList.add("is-done"); btn.textContent = "Copiado ✓";
    setTimeout(() => { btn.classList.remove("is-done"); btn.innerHTML = old; }, 1600);
  }

  const helpBox = () => `
    <div class="help">
      <p class="help__title">Dúvidas sobre o pedido?</p>
      <div class="help__btns">
        <a class="btn-line btn-icon" href="tel:${S.phone}">${ICON.phone}Ligar</a>
        <a class="btn-line btn-icon" href="${waLink("Olá Icarus Studios! Tenho uma dúvida sobre a minha encomenda.")}" target="_blank" rel="noopener">${ICON.wa}WhatsApp</a>
      </div>
    </div>`;

  const summary = (o) => `
    <aside class="co-summary">
      <h2 class="co-h">Resumo${o.ref ? ` <span class="co-ref">#${o.ref}</span>` : ""}</h2>
      ${o.items.map((x) => `
        <div class="co-item">
          ${print(prod(x.slug))}
          <div><strong>${esc(x.title)}</strong><small>${esc(x.size)} · ${x.qty}x</small></div>
          <span>${fmt(x.total)}</span>
        </div>`).join("")}
      <div class="co-rows">
        <div><span>Subtotal</span><span>${fmt(o.subtotal)}</span></div>
        <div><span>Envio · todas as ilhas</span><span>${fmt(o.shipping)}</span></div>
        <div class="co-total"><span>Total</span><span>${fmt(o.total)}</span></div>
      </div>
      <p class="co-note">Entrega em até ${S.deliveryDays} dias após a confirmação do pagamento.</p>
      ${helpBox()}
    </aside>`;

  const steps = (n) => `<ol class="co-steps">${["Dados", "Pagamento", "Concluído"].map((t, i) => `<li class="${i + 1 === n ? "is-on" : i + 1 < n ? "is-done" : ""}"><span>${i + 1}</span>${t}</li>`).join("")}</ol>`;
  const coHead = (n) => `<div class="page-head"><nav class="crumbs"><a href="#/">Início</a><span>/</span><span>Checkout</span></nav><h1>Checkout</h1>${steps(n)}</div>`;

  function viewCheckout() {
    document.title = "Checkout | ICARUS STUDIOS";
    const pending = store.get("icarus-order", null);
    const done = store.get("icarus-done", null);
    if (pending && pending.sig === cartSig() && cart.length) return checkoutPay(pending);
    if (!cart.length && done) return checkoutDone(done);
    if (!cart.length) {
      main.innerHTML = `${coHead(1)}<section class="policy"><p>O teu carrinho está vazio.</p><a class="btn-line" href="#/">Ver artes</a></section>`;
      return;
    }
    checkoutForm();
  }

  // ---------- passo 1: dados do cliente ----------
  function checkoutForm() {
    const items = cart.map((x) => { const p = prod(x.slug), s = S.sizes[x.size]; return { slug: x.slug, title: p.title, size: s.label, qty: x.qty, total: s.price * x.qty }; });
    const o = { items, subtotal: subtotal(), shipping: S.shipping, total: subtotal() + S.shipping };
    const saved = store.get("icarus-customer", {});
    main.innerHTML = `${coHead(1)}
      <section class="co">
        <form class="co-form" novalidate data-co-form>
          <h2 class="co-h">Os teus dados</h2>
          <label class="field"><span>Nome completo *</span><input name="name" autocomplete="name" required value="${esc(saved.name || "")}"></label>
          <label class="field"><span>Telefone *</span><input name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+238 ..." required pattern="[+0-9 ()-]{7,}" value="${esc(saved.phone || "")}"></label>
          <label class="field"><span>Email <em>(opcional)</em></span><input name="email" type="email" autocomplete="email" value="${esc(saved.email || "")}"></label>
          <label class="field"><span>Ilha *</span>
            <select name="island" required>
              <option value="">Escolhe a ilha</option>
              ${S.islands.map((i) => `<option ${saved.island === i ? "selected" : ""}>${i}</option>`).join("")}
            </select>
          </label>
          <label class="field"><span>Endereço de entrega *</span><textarea name="address" rows="3" autocomplete="street-address" placeholder="Cidade, zona, rua, nº da casa e um ponto de referência" required>${esc(saved.address || "")}</textarea></label>
          <label class="check"><input type="checkbox" name="marketing" ${saved.marketing ? "checked" : ""}><span>Quero receber novidades, novos drops e campanhas da Icarus Studios.</span></label>
          <input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
          <p class="co-error" data-co-error role="alert"></p>
          <button class="btn-black" type="submit">Continuar para pagamento — ${fmt(o.total)}</button>
          <p class="co-legal">Ao continuar aceitas os <a href="#/termos">Termos de Serviço</a> e a <a href="#/privacidade">Política de Privacidade</a>. Todas as vendas são finais (<a href="#/reembolso">sem reembolso</a>).</p>
        </form>
        ${summary(o)}
      </section>`;

    const form = $("[data-co-form]", main);
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const f = Object.fromEntries(new FormData(form));
      const err = $("[data-co-error]", main);
      $$(".field", form).forEach((l) => l.classList.remove("is-bad"));
      const bad = [];
      if (f.name.trim().length < 2) bad.push("name");
      if (!/^[+0-9 ()-]{7,}$/.test(f.phone.trim())) bad.push("phone");
      if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) bad.push("email");
      if (!f.island) bad.push("island");
      if (f.address.trim().length < 5) bad.push("address");
      if (bad.length) {
        bad.forEach((n) => form.elements[n].closest(".field").classList.add("is-bad"));
        err.textContent = "Preenche os campos assinalados.";
        form.elements[bad[0]].focus();
        return;
      }
      err.textContent = "";
      const customer = { name: f.name.trim(), phone: f.phone.trim(), email: f.email.trim(), island: f.island, address: f.address.trim(), marketing: !!f.marketing };
      store.set("icarus-customer", customer);
      const order = { ...o, ref: newRef(customer.name), customer, sig: cartSig(), created: new Date().toISOString() };
      const btn = $("button[type=submit]", form); btn.disabled = true; btn.textContent = "A guardar…";
      await sendDB({ action: "order", website: f.website, ...orderPayload(order) });
      store.set("icarus-order", order);
      checkoutPay(order);
      window.scrollTo(0, 0);
    });
  }

  // ---------- passo 2: dados bancários + comprovativo ----------
  function checkoutPay(o) {
    const proofMsg = `Olá Icarus Studios! Segue o comprovativo da transferência.\n\nPedido: #${o.ref}\nNome: ${o.customer.name}\nTotal: ${fmt(o.total)}\n\n${itemsText(o.items)}\n+ Envio: ${fmt(o.shipping)}`;
    const askBankMsg = `Olá Icarus Studios! Fiz o pedido #${o.ref} (${fmt(o.total)}) e preciso dos dados bancários para a transferência.`;
    const row = (label, value, mono) => `
      <div class="bank__row"><span class="bank__label">${label}</span><span class="bank__value${mono ? " is-mono" : ""}">${esc(value)}</span>
      <button type="button" class="copy" data-copy="${esc(value)}" aria-label="Copiar ${label}">${ICON.copy}Copiar</button></div>`;

    main.innerHTML = `${coHead(2)}
      <section class="co">
        <div class="co-form">
          <h2 class="co-h">Pagamento por transferência</h2>
          <p class="co-lead">Faz uma transferência de <strong>${fmt(o.total)}</strong> para a conta abaixo e indica a referência <strong>${o.ref}</strong> no descritivo.</p>
          ${bankReady() ? `
          <div class="bank">
            ${row(`Valor (${S.currency})`, String(Math.round(o.total)), true)}
            ${row("Referência", o.ref, true)}
            ${BANK_FIELDS.map(([k, l]) => row(l, String(PAY.bank[k]).trim(), k !== "holder" && k !== "bank")).join("")}
          </div>` : `
          <div class="policy__callout">Os dados bancários são enviados pelo WhatsApp.
            <a class="btn-line btn-icon" style="margin-top:10px" href="${waLink(askBankMsg)}" target="_blank" rel="noopener">${ICON.wa}Pedir dados bancários</a></div>`}

          <h2 class="co-h">Envia o comprovativo</h2>
          <p class="co-lead">Depois de transferir, envia o comprovativo para prepararmos e enviarmos o teu pedido.</p>
          ${hasDB() ? `
          <div class="proof">
            <label class="drop" data-drop>
              <input type="file" accept="image/*,application/pdf" data-file>
              <span class="drop__txt" data-drop-txt><strong>Carregar comprovativo</strong><br>Foto ou PDF, até 5 MB</span>
            </label>
            <button class="btn-black" type="button" data-upload disabled>Enviar comprovativo</button>
            <p class="co-error" data-up-error role="alert"></p>
          </div>
          <div class="or"><span>ou</span></div>` : ""}
          <a class="btn-line btn-icon btn-wide" href="${waLink(proofMsg)}" target="_blank" rel="noopener" data-wa-proof>${ICON.wa}Enviar comprovativo pelo WhatsApp</a>
          <p class="co-legal">No WhatsApp, anexa a foto ou o PDF do comprovativo à mensagem que já vai escrita.</p>
          <button type="button" class="link-btn" data-edit>← Alterar os meus dados</button>
        </div>
        ${summary(o)}
      </section>`;

    $$("[data-copy]", main).forEach((b) => b.addEventListener("click", () => copyText(b.dataset.copy, b)));
    $("[data-edit]", main).addEventListener("click", () => { store.set("icarus-order", null); checkoutForm(); });
    $("[data-wa-proof]", main).addEventListener("click", () => {
      sendDB({ action: "status", ref: o.ref, status: "Comprovativo via WhatsApp" });
      setTimeout(() => finish(o, "whatsapp"), 400);
    });

    if (!hasDB()) return;
    const input = $("[data-file]", main), up = $("[data-upload]", main), uerr = $("[data-up-error]", main);
    let file = null;
    const kind = (f) => /^image\//.test(f.type) || /\.(jpe?g|png|webp|heic|heif|gif)$/i.test(f.name) ? "image"
      : f.type === "application/pdf" || /\.pdf$/i.test(f.name) ? "pdf" : "";
    input.addEventListener("change", () => {
      file = input.files[0] || null; uerr.textContent = "";
      if (file && !kind(file)) { file = null; uerr.textContent = "Usa uma imagem ou um PDF."; }
      else if (file && file.size > 5 * 1024 * 1024) { file = null; uerr.textContent = "O ficheiro tem mais de 5 MB."; }
      $("[data-drop-txt]", main).innerHTML = file ? `<strong>${esc(file.name)}</strong><br>${(file.size / 1024 / 1024).toFixed(1)} MB · toca para trocar` : `<strong>Carregar comprovativo</strong><br>Foto ou PDF, até 5 MB`;
      $("[data-drop]", main).classList.toggle("has-file", !!file);
      up.disabled = !file;
    });
    up.addEventListener("click", async () => {
      if (!file) return;
      up.disabled = true; up.textContent = "A enviar…"; uerr.textContent = "";
      const payload = await prepareFile(file, kind(file));
      const res = await sendDB({ action: "proof", ...orderPayload(o), file: payload });
      if (res && res.ok) return finish(o, "upload");
      up.disabled = false; up.textContent = "Enviar comprovativo";
      uerr.textContent = res && res.error === "rede"
        ? "Sem ligação à internet. Verifica a rede e tenta de novo, ou envia pelo WhatsApp."
        : "Não foi possível guardar o comprovativo agora. Envia-o pelo WhatsApp (botão abaixo) — o teu pedido fica igual.";
    });
  }

  // lê o ficheiro em base64; fotos são reduzidas para no máx. 1600 px (JPEG) para o envio ser rápido
  const readB64 = (blob) => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(",")[1]); r.onerror = rej; r.readAsDataURL(blob); });
  async function prepareFile(f, k) {
    const base = { name: f.name || "comprovativo", type: f.type || (k === "pdf" ? "application/pdf" : "image/jpeg") };
    if (k === "image") {
      try {
        const bmp = await createImageBitmap(f);
        const sc = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
        const c = Object.assign(document.createElement("canvas"), { width: Math.round(bmp.width * sc), height: Math.round(bmp.height * sc) });
        c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
        const jpg = await new Promise((res) => c.toBlob(res, "image/jpeg", 0.85));
        if (jpg) return { name: base.name.replace(/\.\w+$/, "") + ".jpg", type: "image/jpeg", data: await readB64(jpg) };
      } catch {} // formato que o navegador não abre (ex.: HEIC) → envia o original
    }
    return { ...base, data: await readB64(f) };
  }

  // ---------- passo 3: concluído ----------
  function finish(o, via) {
    const done = { ref: o.ref, name: o.customer.name, total: o.total, via };
    store.set("icarus-done", done);
    store.set("icarus-order", null);
    cart = []; saveCart();
    if (location.hash !== "#/checkout") location.hash = "#/checkout"; else checkoutDone(done);
  }
  function checkoutDone(d) {
    main.innerHTML = `${coHead(3)}
      <section class="co-done">
        <img src="images/logo-wings.webp" alt="" width="120">
        <h2>Obrigado, ${esc(d.name.split(" ")[0])}!</h2>
        <p>O teu pedido <strong>#${d.ref}</strong> (${fmt(d.total)}) foi registado.</p>
        <p>${d.via === "upload" ? "Recebemos o teu comprovativo." : "Não te esqueças de anexar o comprovativo na conversa do WhatsApp."} Assim que confirmarmos o pagamento, preparamos o teu print autografado e enviamos em até ${S.deliveryDays} dias.</p>
        <a class="btn-black" href="#/" style="max-width:320px;margin:24px auto 0">Continuar a ver artes</a>
        ${helpBox()}
      </section>`;
  }

  // ---------- router ----------
  function route() {
    const h = location.hash.replace(/^#\/?/, "");
    const [a, b] = h.split("/");
    if (a === "p") viewProduct(b);
    else if (a === "about") viewAbout();
    else if (POLICIES[a]) viewPolicy(a);
    else if (a === "checkout") viewCheckout();
    else viewHome();
    $("[data-badge]")?.classList.toggle("is-hidden", a === "checkout");
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
    const links = { instagram: S.instagram, threads: S.threads, behance: S.behance, email: `mailto:${S.email}`, whatsapp: `https://wa.me/${S.whatsapp}?text=${encodeURIComponent("Olá Icarus Studios! Gostava de pedir um orçamento.")}` };
    $$("[data-link]").forEach((a) => {
      const url = links[a.dataset.link];
      a.hidden = !url; // rede sem link preenchido em products.js → não aparece
      if (url) a.href = url;
    });
  }

  // ---------- carrinho ----------
  const prod = (slug) => P.find((p) => p.slug === slug);
  let cart = store.get("icarus-cart", []).filter((x) => { const p = prod(x.slug); return p && S.sizes[x.size] && !soldOut(p); });
  const drawer = $(".drawer"), bg = $(".drawer-bg");
  function saveCart() { store.set("icarus-cart", cart); renderCart(); }
  // cópias desta arte já no carrinho (todos os tamanhos contam para a mesma edição)
  const inCart = (slug) => cart.filter((x) => x.slug === slug).reduce((s, x) => s + x.qty, 0);
  function canAdd(slug) {
    const p = prod(slug);
    if (!p.edition) return true;
    if (inCart(slug) < p.left) return true;
    toast(p.left === 1 ? "Só resta 1 cópia desta arte." : `Só restam ${p.left} cópias desta arte.`);
    return false;
  }
  function addToCart(slug, size) {
    if (!canAdd(slug)) return false;
    const it = cart.find((x) => x.slug === slug && x.size === size);
    it ? it.qty++ : cart.push({ slug, size, qty: 1 });
    saveCart();
    return true;
  }
  let toastT;
  function toast(msg) {
    let t = $(".toast");
    if (!t) { t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); document.body.append(t); }
    t.textContent = msg; t.classList.add("is-on");
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("is-on"), 2600);
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
    const sub = cart.reduce((s, x) => s + S.sizes[x.size].price * x.qty, 0);
    $("[data-cart-subtotal]").textContent = fmt(sub);
    $("[data-cart-shipping]").textContent = cart.length ? fmt(S.shipping) : fmt(0);
    $("[data-cart-total]").textContent = fmt(cart.length ? sub + S.shipping : 0);
    $("[data-days]").textContent = S.deliveryDays;
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
    if (q) {
      const it = cart[+q.dataset.q], d = +q.dataset.d;
      if (d > 0 && !canAdd(it.slug)) return;
      it.qty += d; if (it.qty < 1) cart.splice(+q.dataset.q, 1); saveCart();
    }
    if (r) { cart.splice(+r.dataset.rm, 1); saveCart(); }
  });
  $("[data-checkout]").addEventListener("click", () => {
    if (!cart.length) return;
    if (location.hash === "#/checkout") { closeCart(); route(); } else location.hash = "#/checkout";
  });

  // ---------- newsletter ----------
  $("[data-news]").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target, msg = $("[data-news-msg]"), btn = $("button", form);
    const email = $("#news-email", form).value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { msg.textContent = "Escreve um email válido."; return; }
    btn.disabled = true; msg.textContent = "A enviar…";
    const r = await sendDB({ action: "newsletter", email, website: form.website.value });
    btn.disabled = false;
    if (r.ok) {
      form.reset();
      msg.textContent = "Obrigado! Vais receber as novidades em primeira mão.";
    } else {
      msg.innerHTML = `Não foi possível subscrever agora. Tenta de novo ou <a href="mailto:${esc(S.email)}?subject=${encodeURIComponent("Newsletter Icarus Studios")}&body=${encodeURIComponent("Quero subscrever: " + email)}">envia-nos um email</a>.`;
    }
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

  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  $("[data-year]").textContent = new Date().getFullYear();
  window.addEventListener("hashchange", route);
  renderCart();
  route();
})();
