/* Corte dei Lentischi — demo Mockly. JavaScript puro, nessuna libreria. */
(function () {
  "use strict";

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var WA = "https://wa.me/393517578080";
  var NOME_DEMO = "Corte dei Lentischi";

  /* ── Apertura: la busta (si può saltare) ─────────── */
  function go() { root.classList.add("go"); }
  (function opening() {
    var op = $(".opening");
    if (!op || root.classList.contains("seen") || reduce) { go(); return; }
    try { sessionStorage.setItem("ci-apertura", "1"); } catch (e) { /* va bene lo stesso */ }
    var timer = setTimeout(function () { go(); }, 1000);
    function skip() {
      clearTimeout(timer);
      op.classList.add("is-gone");
      go();
    }
    op.addEventListener("click", skip);
    var s = $(".opening__skip", op);
    if (s) s.addEventListener("click", function (e) { e.stopPropagation(); skip(); });
    setTimeout(function () { op.classList.add("is-gone"); }, 1500);
  })();

  /* ── Intestazione piena dopo un po' di scroll ────── */
  var head = $(".head");
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      if (head) head.classList.toggle("is-solid", window.scrollY > 24);
      updateDay();
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ── Menu ─────────────────────────────────────────── */
  (function menu() {
    var btn = $(".menu-btn"), panel = $("#menu"), veil = $(".veil"), close = $(".menu__close");
    if (!btn || !panel) return;
    var lockables = $$("main, footer, .dock");
    function set(open) {
      panel.classList.toggle("is-open", open);
      veil.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      root.classList.toggle("menu-open", open);
      lockables.forEach(function (el) { if (open) el.setAttribute("inert", ""); else el.removeAttribute("inert"); });
      if (open) { setTimeout(function () { close.focus(); }, 30); } else { btn.focus({ preventScroll: true }); }
    }
    btn.addEventListener("click", function () { set(true); });
    close.addEventListener("click", function () { set(false); });
    veil.addEventListener("click", function () { set(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && panel.classList.contains("is-open")) set(false);
      if (e.key === "Tab" && panel.classList.contains("is-open")) {
        var f = $$("a, button", panel).filter(function (x) { return x.offsetParent !== null; });
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    $$("a", panel).forEach(function (a) { a.addEventListener("click", function () { if (panel.classList.contains("is-open")) { panel.classList.remove("is-open"); veil.classList.remove("is-open"); root.classList.remove("menu-open"); lockables.forEach(function (el) { el.removeAttribute("inert"); }); btn.setAttribute("aria-expanded", "false"); } }); });
    window.matchMedia("(min-width: 1024px)").addEventListener("change", function (m) { if (m.matches && panel.classList.contains("is-open")) set(false); });
  })();

  /* ── Barra fissa: nascosta mentre si vede la prima schermata o un'area con il suo pulsante ── */
  (function dock() {
    var d = $(".dock"), zones = $$("[data-hero], [data-nodock]");
    if (!d || !zones.length || !("IntersectionObserver" in window)) return;
    d.classList.add("is-hidden");
    var hidden = new Set();
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) {
        var soglia = x.target.hasAttribute("data-hero") ? 0.45 : 0.15;
        if (x.isIntersecting && x.intersectionRatio > soglia) hidden.add(x.target); else hidden.delete(x.target);
      });
      d.classList.toggle("is-hidden", hidden.size > 0);
    }, { threshold: [0, 0.15, 0.45, 0.6, 1] });
    zones.forEach(function (z) { io.observe(z); });
  })();

  /* ── Comparse allo scroll ─────────────────────────── */
  (function reveal() {
    var els = $$(".rv");
    if (!els.length) return;
    if (reduce || !("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach(function (e) { io.observe(e); });
  })();

  /* ── Il vostro giorno: il cielo si fa sera mentre scorri ── */
  var dayEl = $(".day"), sky = $(".day__sky"), fill = $(".day__line i");
  function updateDay() {
    if (!dayEl || reduce) return;
    var r = dayEl.getBoundingClientRect(), vh = window.innerHeight;
    var p = Math.min(1, Math.max(0, (vh * 0.65 - r.top) / (r.height - vh * 0.1)));
    sky.style.opacity = (p * 0.95).toFixed(3);
    fill.style.transform = "scaleY(" + p.toFixed(3) + ")";
  }
  (function dayItems() {
    var items = $$(".day__list li");
    if (!items.length) return;
    if (reduce || !("IntersectionObserver" in window)) { items.forEach(function (i) { i.classList.add("lit"); }); return; }
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { x.target.classList.toggle("lit", x.isIntersecting); });
    }, { rootMargin: "-30% 0px -30% 0px" });
    items.forEach(function (i) { io.observe(i); });
  })();

  /* ── Quanti siete? ────────────────────────────────── */
  (function quiz() {
    var box = $(".quiz__nums"), out = $(".quiz__out");
    if (!box) return;
    var T = {
      40: { s: "sala", t: "In 40 il prato è troppo largo. La sala coperta tiene tutti vicini, con le luci basse e un tavolo imperiale solo." },
      80: { s: "corte", t: "In 80 la corte è giusta: mattoni intorno, tavoli lunghi, nessuno lontano dalla festa." },
      120: { s: "prato", t: "In 120 serve il prato. Se piove, la sala coperta resta come piano B con la stessa data." },
      140: { s: "prato", t: "In 140 si arriva al limite del prato: tutti seduti, con la pista da ballo che resta libera." }
    };
    $$("button", box).forEach(function (b) {
      b.addEventListener("click", function () {
        var n = b.dataset.n, d = T[n];
        $$("button", box).forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        out.classList.remove("is-empty");
        out.innerHTML = "";
        var p = document.createElement("p"); p.textContent = d.t;
        var a = document.createElement("a"); a.className = "link";
        a.href = "spazi.html?spazio=" + d.s + "&ospiti=" + n + "#simulatore";
        a.textContent = "Guardate come la sistemiamo";
        out.appendChild(p); out.appendChild(a);
      });
    });
  })();

  /* ── Sigillo finale ───────────────────────────────── */
  $$("[data-seal]").forEach(function (s) {
    s.addEventListener("click", function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || reduce) return;
      e.preventDefault();
      s.classList.add("is-cracking");
      setTimeout(function () { window.location.href = s.getAttribute("href"); }, 280);
    });
  });

  /* ═══════════ Piantina (simulatore e anteprima) ═══════════ */
  var SPAZI = {
    prato: { nome: "Il prato", cap: 140, base: 900, u: { x: 36, y: 52, w: 328, h: 196 } },
    corte: { nome: "La corte", cap: 90, base: 1200, u: { x: 58, y: 66, w: 284, h: 168 } },
    sala: { nome: "La sala coperta", cap: 110, base: 700, u: { x: 50, y: 60, w: 300, h: 180 } }
  };
  var LUCI = { giorno: { nome: "giorno", cost: 0 }, sera: { nome: "sera", cost: 250 }, festa: { nome: "festa", cost: 600 } };
  var PER_OSPITE = 18;

  function el(tag, attrs) {
    var n = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }
  function f(n) { return Math.round(n * 10) / 10; }

  function seatsAround(g, cx, cy, r, count) {
    for (var k = 0; k < count; k++) {
      var a = (Math.PI * 2 * k) / 8 - Math.PI / 2;
      g.appendChild(el("circle", { cx: f(cx + Math.cos(a) * (r + 5)), cy: f(cy + Math.sin(a) * (r + 5)), r: 3.1, class: "seat" }));
    }
  }

  function layoutRound(g, n, a) {
    var T = Math.ceil(n / 8);
    var cols = Math.max(1, Math.round(Math.sqrt(T * a.w / a.h)));
    while (cols * Math.ceil(T / cols) < T) cols++;
    var rows = Math.ceil(T / cols);
    var cw = a.w / cols, rh = a.h / rows;
    var r = Math.max(7, Math.min(18, Math.min(cw, rh) * 0.3));
    var left = n, candles = [];
    for (var i = 0; i < T; i++) {
      var row = Math.floor(i / cols), col = i % cols;
      var inRow = Math.min(cols, T - row * cols);
      var off = ((cols - inRow) * cw) / 2;
      var cx = a.x + off + (col + 0.5) * cw, cy = a.y + (row + 0.5) * rh;
      g.appendChild(el("circle", { cx: f(cx), cy: f(cy), r: f(r), class: "tbl" }));
      var s = Math.min(8, left); left -= s;
      seatsAround(g, cx, cy, r, s);
      candles.push([cx, cy]);
    }
    return { tables: T, candles: candles, label: T + (T === 1 ? " tavolo rotondo" : " tavoli rotondi") };
  }

  function layoutLong(g, n, a) {
    var rowsN = Math.max(1, Math.min(5, Math.ceil(n / 26)));
    var per = Math.ceil(n / rowsN), side = Math.ceil(per / 2);
    var sp = Math.min(17, (a.w - 16) / side), len = side * sp, left = n, candles = [];
    for (var j = 0; j < rowsN; j++) {
      var y = a.y + ((j + 0.5) * a.h) / rowsN, x0 = a.x + (a.w - len) / 2;
      var inRow = Math.min(per, left); left -= inRow;
      g.appendChild(el("rect", { x: f(x0 - 3), y: f(y - 6.5), width: f(len + 6), height: 13, rx: 1.5, class: "tbl" }));
      var top = Math.ceil(inRow / 2), bot = inRow - top;
      for (var i = 0; i < top; i++) g.appendChild(el("circle", { cx: f(x0 + (i + 0.5) * sp), cy: f(y - 11.5), r: 3.1, class: "seat" }));
      for (var k = 0; k < bot; k++) g.appendChild(el("circle", { cx: f(x0 + (k + 0.5) * sp), cy: f(y + 11.5), r: 3.1, class: "seat" }));
      for (var c = 0; c < 3; c++) candles.push([x0 + (len * (c + 0.5)) / 3, y]);
    }
    return { tables: rowsN, candles: candles, label: rowsN + (rowsN === 1 ? " tavolo imperiale" : " tavoli imperiali") };
  }

  function decor(g, space, uses) {
    var d = el("g", { class: "deco" });
    if (space === "prato") {
      d.appendChild(el("rect", { x: 14, y: 14, width: 372, height: 272, rx: 26, fill: "none", class: "wall", "stroke-dasharray": "2 7", "stroke-linecap": "round" }));
      [[30, 34], [370, 34], [30, 266], [370, 266], [200, 28], [120, 272], [290, 272]].forEach(function (p) {
        d.appendChild(el("circle", { cx: p[0], cy: p[1], r: 15, class: "tree" }));
        d.appendChild(el("circle", { cx: p[0], cy: p[1], r: 4, class: "trunk" }));
      });
    } else if (space === "corte") {
      d.appendChild(el("rect", { x: 22, y: 22, width: 356, height: 256, class: "wall", fill: "none", "stroke-width": 9 }));
      for (var i = 0; i < 7; i++) d.appendChild(el("path", { d: "M" + (48 + i * 50) + " 30 v-0 a12 12 0 0 1 24 0", class: "wall", fill: "none", "stroke-width": 2, transform: "translate(0 24)" }));
      d.appendChild(el("rect", { x: 170, y: 273, width: 60, height: 10, class: "door" }));
      d.appendChild(el("circle", { cx: 200, cy: 150, r: 0.1 }));
    } else {
      d.appendChild(el("rect", { x: 22, y: 26, width: 356, height: 248, class: "wall", fill: "none", "stroke-width": 8 }));
      for (var c = 0; c < 5; c++) {
        d.appendChild(el("rect", { x: 70 + c * 66, y: 30, width: 9, height: 9, class: "col" }));
        d.appendChild(el("rect", { x: 70 + c * 66, y: 261, width: 9, height: 9, class: "col" }));
      }
      d.appendChild(el("rect", { x: 170, y: 268, width: 60, height: 10, class: "door" }));
    }
    g.appendChild(d);
  }

  function stringLights(g, space) {
    var L = el("g", { class: "lights" });
    var paths = space === "prato"
      ? ["M30 34 Q115 74 200 28", "M200 28 Q285 74 370 34", "M30 266 Q115 232 200 272", "M200 272 Q285 232 370 266"]
      : space === "corte"
        ? ["M40 48 Q120 76 200 48", "M200 48 Q280 76 360 48", "M40 252 Q120 226 200 252", "M200 252 Q280 226 360 252"]
        : ["M40 50 L360 50", "M40 250 L360 250"];
    paths.forEach(function (d, i) {
      L.appendChild(el("path", { d: d, fill: "none", class: "bulbs " + (i % 2 ? "tw2" : "tw1"), "stroke-width": 4, "stroke-linecap": "round", "stroke-dasharray": "0.1 9" }));
    });
    g.appendChild(L);
  }

  function renderPlan(svg, st) {
    var S = SPAZI[st.spazio], party = st.luci === "festa";
    svg.innerHTML = "";
    svg.appendChild(el("rect", { width: 400, height: 300, class: "day-bg", fill: "#ebe2cb" }));
    var nightG = el("g", { class: "night" });
    nightG.appendChild(el("rect", { width: 400, height: 300, fill: "#0d1a13" }));
    svg.appendChild(nightG);
    decor(svg, st.spazio);
    var area = { x: S.u.x, y: S.u.y, w: S.u.w, h: S.u.h };
    if (party) area.w = S.u.w * 0.68;
    var tg = el("g", { class: "tables" });
    svg.appendChild(tg);
    var res = st.tavoli === "imperiali" ? layoutLong(tg, st.ospiti, area) : layoutRound(tg, st.ospiti, area);
    var cg = el("g", { class: "lights" });
    res.candles.forEach(function (c, i) { cg.appendChild(el("circle", { cx: f(c[0]), cy: f(c[1]), r: 2.6, class: "flame " + (i % 2 ? "tw2" : "tw1") })); });
    svg.appendChild(cg);
    stringLights(svg, st.spazio);
    var pg = el("g", { class: "party" });
    var px = S.u.x + S.u.w * 0.68 + (S.u.w * 0.32) / 2, py = S.u.y + S.u.h / 2;
    var pr = Math.min(S.u.w * 0.14, S.u.h * 0.34);
    pg.appendChild(el("rect", { x: f(px - pr), y: f(py - pr), width: f(pr * 2), height: f(pr * 2), class: "floor" }));
    pg.appendChild(el("circle", { cx: f(px), cy: f(py), r: f(pr * 0.62), class: "pulse ring" }));
    pg.appendChild(el("circle", { cx: f(px), cy: f(py), r: 3, class: "spot" }));
    svg.appendChild(pg);
    svg.classList.toggle("is-dark", st.luci !== "giorno");
    svg.classList.toggle("has-lights", st.luci !== "giorno");
    svg.classList.toggle("is-party", party);
    return res;
  }

  function prezzo(st) {
    var S = SPAZI[st.spazio];
    return S.base + st.ospiti * PER_OSPITE + LUCI[st.luci].cost;
  }
  function euro(n) {
    var s = String(n), out = "";
    while (s.length > 3) { out = "." + s.slice(-3) + out; s = s.slice(0, -3); }
    return "€ " + s + out;
  }

  /* Anteprima automatica in home */
  (function demo() {
    var svg = $("#plan-demo");
    if (!svg) return;
    var steps = [
      { spazio: "corte", tavoli: "rotondi", ospiti: 60, luci: "giorno" },
      { spazio: "corte", tavoli: "imperiali", ospiti: 80, luci: "sera" },
      { spazio: "prato", tavoli: "rotondi", ospiti: 120, luci: "festa" }
    ];
    var i = 0;
    function draw() { renderPlan(svg, steps[i]); svg.setAttribute("aria-label", "Esempio di piantina: " + SPAZI[steps[i].spazio].nome + ", " + steps[i].ospiti + " ospiti, luci " + steps[i].luci); }
    draw();
    if (reduce || !("IntersectionObserver" in window)) return;
    var timer = null;
    new IntersectionObserver(function (en) {
      if (en[0].isIntersecting) { if (!timer) timer = setInterval(function () { i = (i + 1) % steps.length; draw(); }, 2600); }
      else { clearInterval(timer); timer = null; }
    }).observe(svg);
  })();

  /* Simulatore vero */
  (function sim() {
    var svg = $("#plan");
    if (!svg) return;
    var form = $("#sim-form");
    var st = { spazio: "corte", tavoli: "rotondi", ospiti: 80, luci: "sera" };
    var q = new URLSearchParams(location.search);
    if (SPAZI[q.get("spazio")]) st.spazio = q.get("spazio");
    if (q.get("tavoli") === "imperiali" || q.get("tavoli") === "rotondi") st.tavoli = q.get("tavoli");
    if (LUCI[q.get("luci")]) st.luci = q.get("luci");
    var qo = parseInt(q.get("ospiti"), 10);
    if (qo >= 20) st.ospiti = Math.min(qo, SPAZI[st.spazio].cap);

    var range = $("#ospiti"), out = $("#ospiti-out"), msg = $("#sim-msg"), sum = $("#sim-sum"), cta = $("#sim-cta");

    function update(note) {
      var cap = SPAZI[st.spazio].cap;
      range.max = cap;
      if (st.ospiti > cap) { note = SPAZI[st.spazio].nome + " arriva a " + cap + " ospiti seduti: abbiamo portato il numero a " + cap + "."; st.ospiti = cap; }
      range.value = st.ospiti;
      out.firstChild.nodeValue = st.ospiti;
      var res = renderPlan(svg, st);
      var tot = prezzo(st);
      var lbl = SPAZI[st.spazio].nome + ", " + st.ospiti + " ospiti, " + res.label + ", luci " + LUCI[st.luci].nome;
      svg.setAttribute("aria-label", "Piantina dall'alto: " + lbl);
      sum.innerHTML = "";
      var b = document.createElement("strong"); b.textContent = lbl;
      sum.appendChild(b);
      sum.appendChild(document.createTextNode(". Prezzo di esempio: da " + euro(tot) + "."));
      if (st.luci === "festa" && !note) note = "Con le luci da festa lasciamo libera la pista da ballo: i tavoli si stringono un po'.";
      msg.textContent = note || "";
      cta.href = "richiedi.html?spazio=" + st.spazio + "&tavoli=" + st.tavoli + "&ospiti=" + st.ospiti + "&luci=" + st.luci;
      $$("input[name=spazio]").forEach(function (r) { r.checked = r.value === st.spazio; });
      $$("input[name=tavoli]").forEach(function (r) { r.checked = r.value === st.tavoli; });
      $$("input[name=luci]").forEach(function (r) { r.checked = r.value === st.luci; });
    }

    form.addEventListener("change", function (e) {
      var t = e.target;
      if (t.name === "spazio") st.spazio = t.value;
      if (t.name === "tavoli") st.tavoli = t.value;
      if (t.name === "luci") st.luci = t.value;
      update();
    });
    range.addEventListener("input", function () { st.ospiti = parseInt(range.value, 10); update(); });
    $("#piu").addEventListener("click", function () { st.ospiti = Math.min(SPAZI[st.spazio].cap, st.ospiti + 5); update(st.ospiti === SPAZI[st.spazio].cap ? "Questo è il massimo per " + SPAZI[st.spazio].nome.toLowerCase() + "." : ""); });
    $("#meno").addEventListener("click", function () { st.ospiti = Math.max(20, st.ospiti - 5); update(st.ospiti === 20 ? "Sotto i 20 ospiti conviene un tavolo unico: scriveteci e lo vediamo insieme." : ""); });
    $$("[data-spazio]").forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        st.spazio = a.dataset.spazio; update();
        $("#simulatore").scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
        history.replaceState(null, "", "#simulatore");
      });
    });
    update();
  })();

  /* ═══════════ Modulo "Richiedi una data" ═══════════ */
  (function request() {
    var form = $("#richiesta");
    if (!form) return;
    var q = new URLSearchParams(location.search);
    var spaziNome = { prato: "Il prato", corte: "La corte", sala: "La sala coperta", boh: "Non so, consigliatemi" };
    var fasciaNome = { pranzo: "Pranzo", cena: "Cena", giorno: "Tutto il giorno" };

    function pad(n) { return (n < 10 ? "0" : "") + n; }
    function iso(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
    var min = new Date(); min.setDate(min.getDate() + 14);
    var max = new Date(); max.setFullYear(max.getFullYear() + 2);
    var data = form.elements.data;
    data.min = iso(min); data.max = iso(max);

    if (spaziNome[q.get("spazio")]) form.elements.spazio.value = q.get("spazio");
    var o = parseInt(q.get("ospiti"), 10);
    if (o >= 1 && o <= 300) form.elements.ospiti.value = o;
    var allest = "";
    if (q.get("tavoli") && LUCI[q.get("luci")]) {
      var tv = q.get("tavoli") === "imperiali" ? "tavoli imperiali" : "tavoli rotondi";
      allest = tv + ", luci " + LUCI[q.get("luci")].nome;
    }
    var allestEl = $("#allestimento-nota");
    if (allest && allestEl) { allestEl.textContent = "Allestimento scelto nel simulatore: " + allest + "."; allestEl.hidden = false; }

    var s = {
      evento: $("[data-s=evento]"), data: $("[data-s=data]"), fascia: $("[data-s=fascia]"),
      ospiti: $("[data-s=ospiti]"), spazio: $("[data-s=spazio]"), allest: $("[data-s=allest]"), nome: $("[data-s=nome]")
    };
    function dataLunga(v) {
      if (!v) return "";
      var d = new Date(v + "T12:00:00");
      return d.toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    }
    function fill(node, text, vuoto) {
      node.textContent = text || vuoto;
      node.classList.toggle("is-empty", !text);
    }
    function summary() {
      var e = form.elements;
      fill(s.evento, e.evento.value, "da scegliere");
      fill(s.data, dataLunga(e.data.value), "da scegliere");
      fill(s.fascia, fasciaNome[e.fascia.value], "da scegliere");
      fill(s.ospiti, e.ospiti.value ? e.ospiti.value + " ospiti" : "", "da scrivere");
      fill(s.spazio, spaziNome[e.spazio.value], "da scegliere");
      fill(s.allest, allest, "nessuno scelto");
      fill(s.nome, e.nome.value.trim(), "da scrivere");
    }
    form.addEventListener("input", summary);
    form.addEventListener("change", summary);
    summary();

    function fieldOf(input) { return input.closest(".field"); }
    function setErr(input, text) {
      var fl = fieldOf(input), er = $(".field__err", fl);
      fl.classList.toggle("has-error", !!text);
      if (er) er.textContent = text || "";
      input.setAttribute("aria-invalid", text ? "true" : "false");
    }
    function validate() {
      var e = form.elements, bad = null, ok = true;
      function check(inp, cond, text) { if (!cond) { setErr(inp, text); if (!bad) bad = inp; ok = false; } else setErr(inp, ""); }
      check(e.evento, !!e.evento.value, "Scegliete che tipo di evento è.");
      var dv = e.data.value;
      check(e.data, !!dv && dv >= data.min && dv <= data.max, !dv ? "Scegliete una data." : "Scegliete una data tra " + dataLunga(data.min) + " e due anni da oggi: serve tempo per il sopralluogo.");
      var n = parseInt(e.ospiti.value, 10);
      check(e.ospiti, n >= 1 && n <= 300, "Scrivete quanti ospiti, da 1 a 300.");
      check(e.nome, e.nome.value.trim().length >= 2, "Scrivete il vostro nome.");
      if (bad) bad.focus();
      return ok;
    }
    $$("input, select, textarea", form).forEach(function (i) { i.addEventListener("blur", function () { if (i.name === "nome" || i.name === "evento" || i.name === "data" || i.name === "ospiti") { if (fieldOf(i).classList.contains("has-error")) validate(); } }); });

    function messaggio() {
      var e = form.elements;
      var righe = [
        "Ciao Mockly! Vi scrivo dal sito dimostrativo «" + NOME_DEMO + "» (l'attività è inventata): questa è una prova, non una richiesta vera.",
        "",
        "Evento: " + e.evento.value,
        "Data: " + dataLunga(e.data.value),
        "Fascia: " + fasciaNome[e.fascia.value],
        "Ospiti: " + e.ospiti.value,
        "Spazio: " + spaziNome[e.spazio.value]
      ];
      if (allest) righe.push("Allestimento: " + allest);
      righe.push("Nome: " + e.nome.value.trim());
      if (e.note.value.trim()) righe.push("Note: " + e.note.value.trim());
      return righe.join("\n");
    }

    var btn = $("#invia"), sent = $("#inviata"), copy = $("#copia"), txt = $("#testo-msg"), wa = $("#apri-wa");
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (!validate()) return;
      var m = messaggio();
      btn.disabled = true;
      btn.innerHTML = '<span class="spin" aria-hidden="true"></span> Preparo il messaggio…';
      txt.value = m;
      var url = WA + "?text=" + encodeURIComponent(m);
      wa.href = url;
      setTimeout(function () {
        btn.disabled = false;
        btn.textContent = "Prepara di nuovo";
        sent.classList.add("is-on");
        sent.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" });
        window.location.href = url;
      }, reduce ? 0 : 700);
    });
    if (copy) copy.addEventListener("click", function () {
      txt.select();
      var done = function () { copy.textContent = "Copiato"; setTimeout(function () { copy.textContent = "Copia il messaggio"; }, 1800); };
      if (navigator.clipboard) navigator.clipboard.writeText(txt.value).then(done, function () { document.execCommand("copy"); done(); });
      else { document.execCommand("copy"); done(); }
    });
  })();
})();
