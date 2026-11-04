/* =========================================================
   CONFIGURAÇÃO
   Coloque aqui o seu usuário do GitHub (ex.: "guilhermefernandes").
   Todos os links de GitHub do site são atualizados a partir daqui.
   ========================================================= */
const GITHUB_USER = "guilhermedevbh";

(() => {
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* ---------- GitHub ---------- */
  const ghUrl = GITHUB_USER ? `https://github.com/${GITHUB_USER}` : "https://github.com/";
  $$("[data-github]").forEach((a) => (a.href = ghUrl));
  $$("[data-github-label]").forEach((el) => (el.textContent = GITHUB_USER ? `@${GITHUB_USER}` : "@seu-usuario"));

  /* ---------- Nome do hero letra a letra ---------- */
  let n = 0;
  $$("[data-split]").forEach((el) => {
    const text = el.textContent.trim();
    el.textContent = "";
    for (const c of text) {
      const s = document.createElement("span");
      s.className = "ch";
      s.style.setProperty("--i", n++);
      s.textContent = c;
      el.appendChild(s);
    }
  });

  /* ---------- Barras de status ---------- */
  $$(".bar").forEach((bar) => {
    const lv = +bar.dataset.lv || 0;
    for (let i = 0; i < 5; i++) {
      const seg = document.createElement("i");
      if (i < lv) {
        seg.className = "on";
        seg.style.setProperty("--d", i);
      }
      bar.appendChild(seg);
    }
  });

  /* ---------- Nav: progresso, seção ativa e menu ---------- */
  const nav = $(".nav");
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    nav.style.setProperty("--p", max > 0 ? Math.min(1, scrollY / max) : 0);
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const links = $$(".nav-links a");
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${e.target.id}`));
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  $$("main section[id]").forEach((s) => spy.observe(s));

  const menuBtn = $(".menu-btn");
  const menu = $("#menu");
  menuBtn.addEventListener("click", () => {
    const open = menu.classList.toggle("is-open");
    menuBtn.setAttribute("aria-expanded", open);
    menuBtn.textContent = open ? "fechar" : "menu";
  });
  links.forEach((a) =>
    a.addEventListener("click", () => {
      menu.classList.remove("is-open");
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.textContent = "menu";
    })
  );

  /* ---------- Revelar ao rolar ---------- */
  const reveal = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          reveal.unobserve(e.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px" }
  );
  $$("[data-reveal]").forEach((el) => reveal.observe(el));

  /* ---------- Press start (Enter) ---------- */
  addEventListener("keydown", (e) => {
    if (e.key !== "Enter" || scrollY > 80) return;
    if (e.target.closest("input, textarea, button, a")) return;
    $("#sobre").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  });

  /* ---------- Missões: filtros e grade/lista ---------- */
  const filters = $$(".filter");
  const missions = $$(".mission");
  filters.forEach((btn) =>
    btn.addEventListener("click", () => {
      const f = btn.dataset.filter;
      filters.forEach((b) => b.setAttribute("aria-pressed", b === btn));
      missions.forEach((m) => (m.hidden = f !== "all" && !m.dataset.cats.split(" ").includes(f)));
    })
  );

  const views = $$(".view");
  const grid = $(".missions");
  views.forEach((btn) =>
    btn.addEventListener("click", () => {
      views.forEach((b) => b.setAttribute("aria-pressed", b === btn));
      grid.classList.toggle("is-list", btn.dataset.view === "list");
    })
  );

  /* ---------- Copiar e-mail ---------- */
  $$("[data-copy]").forEach((btn) =>
    btn.addEventListener("click", async () => {
      const value = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(value);
      } catch {
        const t = document.createElement("textarea");
        t.value = value;
        document.body.appendChild(t);
        t.select();
        document.execCommand("copy");
        t.remove();
      }
      btn.textContent = "copiado!";
      setTimeout(() => (btn.textContent = "copiar"), 1600);
    })
  );

  /* ---------- Formulário: abre o e-mail com a mensagem pronta ---------- */
  const form = $(".term");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = form.nome.value.trim();
    const msg = form.mensagem.value.trim();
    if (!msg) {
      form.mensagem.classList.add("is-error");
      form.mensagem.focus();
      return;
    }
    form.mensagem.classList.remove("is-error");
    const subject = `Contato pelo portfólio${nome ? ` · ${nome}` : ""}`;
    const body = `${msg}${nome ? `\n\n${nome}` : ""}`;
    location.href = `mailto:gfernandesouza@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    $(".term-note").textContent = "abrindo o seu app de e-mail…";
  });

  /* ---------- Roda algo só enquanto está na tela ---------- */
  function whileVisible(el, start, stop) {
    new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop())).observe(el);
  }

  /* =========================================================
     FLIPERAMA · ~/games/auditoria.exe
     ========================================================= */
  (function arcade() {
    const canvas = $(".arcade-screen");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const PX = 3;

    // sprites 11x8: nota fiscal com erro, bug (2 quadros) e a nave
    const SPRITES = {
      doc: [
        "..XXXXXX...",
        "..X....XX..",
        "..X.XX.XXX.",
        "..X......X.",
        "..X.XXXX.X.",
        "..X......X.",
        "..X.XXX..X.",
        "..XXXXXXXX.",
      ],
      bugA: [
        "...X...X...",
        "....X.X....",
        "...XXXXX...",
        "..XX.X.XX..",
        ".XXXXXXXXX.",
        ".X.XXXXX.X.",
        ".X.X...X.X.",
        "....X.X....",
      ],
      bugB: [
        "...X...X...",
        "....X.X....",
        "...XXXXX...",
        "..XX.X.XX..",
        "XXXXXXXXXXX",
        "..XXXXXXX..",
        ".X.......X.",
        "X.........X",
      ],
      ship: [
        ".....X.....",
        "....XXX....",
        "....XXX....",
        ".XXXXXXXXX.",
        "XXXXXXXXXXX",
        "XXXXXXXXXXX",
      ],
    };
    const SW = 11 * PX;
    const SH = 8 * PX;
    const GAP_X = 46;
    const GAP_Y = 34;

    let W = 0, H = 0;
    let running = false, raf = 0, last = 0;
    const s = {
      score: 0, wave: 1, fines: 0,
      foes: [], cols: 7, rows: 3, ox: 0, oy: 0, dir: 1,
      shipX: 0, bullets: [], drops: [], parts: [],
      hover: false, mx: 0, cool: 0, dropT: 1, flash: 0, t: 0,
    };

    function resize() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
      if (!s.foes.length) spawn();
      s.shipX = Math.min(Math.max(s.shipX || W / 2, 20), W - 20);
    }

    function spawn() {
      s.cols = W < 380 ? 5 : W < 520 ? 6 : 7;
      s.foes = [];
      for (let r = 0; r < s.rows; r++)
        for (let c = 0; c < s.cols; c++) s.foes.push({ c, r, alive: true, kind: r === 0 ? "doc" : "bug" });
      s.ox = (W - formationW()) / 2;
      s.oy = 44;
      s.dir = 1;
    }
    const formationW = () => (s.cols - 1) * GAP_X + SW;
    const foeX = (f) => s.ox + f.c * GAP_X;
    const foeY = (f) => s.oy + f.r * GAP_Y;

    function drawSprite(rows, x, y, color) {
      ctx.fillStyle = color;
      for (let j = 0; j < rows.length; j++)
        for (let i = 0; i < rows[j].length; i++)
          if (rows[j][i] === "X") ctx.fillRect(Math.round(x + i * PX), Math.round(y + j * PX), PX, PX);
    }

    function burst(x, y) {
      for (let i = 0; i < 10; i++) {
        const a = Math.random() * Math.PI * 2;
        const v = 40 + Math.random() * 90;
        s.parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: .5 + Math.random() * .3 });
      }
    }

    function shoot() {
      if (s.cool > 0 || s.bullets.length >= 3) return;
      s.bullets.push({ x: s.shipX, y: H - 34 });
      s.cool = s.hover ? .25 : .42;
    }

    function update(dt) {
      s.t += dt;
      s.cool -= dt;
      s.flash = Math.max(0, s.flash - dt);
      const alive = s.foes.filter((f) => f.alive);

      // formação
      const killed = 1 - alive.length / s.foes.length;
      const speed = 22 + s.wave * 6 + killed * 46;
      s.ox += s.dir * speed * dt;
      const xs = alive.map(foeX);
      const minX = Math.min(...xs), maxX = Math.max(...xs) + SW;
      if ((s.dir > 0 && maxX > W - 10) || (s.dir < 0 && minX < 10)) {
        s.dir *= -1;
        s.oy += 10;
      }
      const lowest = Math.max(...alive.map(foeY)) + SH;
      if (lowest > H - 64) spawn();

      // nave: segue o mouse ou joga sozinha
      let target = s.shipX;
      if (s.hover) target = s.mx;
      else if (alive.length) {
        const pick = alive.reduce((best, f) => {
          const d = Math.abs(foeX(f) + SW / 2 - s.shipX);
          return d < best.d ? { f, d } : best;
        }, { f: null, d: Infinity }).f;
        target = foeX(pick) + SW / 2 + s.dir * 14;
        if (Math.abs(target - s.shipX) < 10) shoot();
      }
      const maxV = s.hover ? 900 : 190;
      const dx = target - s.shipX;
      s.shipX += Math.sign(dx) * Math.min(Math.abs(dx), maxV * dt);
      s.shipX = Math.min(Math.max(s.shipX, 18), W - 18);

      // tiros
      s.bullets.forEach((b) => (b.y -= 340 * dt));
      s.bullets = s.bullets.filter((b) => {
        if (b.y < 20) return false;
        for (const f of alive) {
          const x = foeX(f), y = foeY(f);
          if (f.alive && b.x > x && b.x < x + SW && b.y > y && b.y < y + SH) {
            f.alive = false;
            s.score++;
            burst(x + SW / 2, y + SH / 2);
            return false;
          }
        }
        return true;
      });

      // as notas revidam
      s.dropT -= dt;
      if (s.dropT <= 0 && alive.length) {
        const f = alive[(Math.random() * alive.length) | 0];
        s.drops.push({ x: foeX(f) + SW / 2, y: foeY(f) + SH });
        s.dropT = .9 + Math.random() * .9;
      }
      s.drops.forEach((d) => (d.y += 150 * dt));
      s.drops = s.drops.filter((d) => {
        if (d.y > H) return false;
        if (d.y > H - 34 && d.y < H - 14 && Math.abs(d.x - s.shipX) < SW / 2) {
          s.fines++;
          s.flash = .35;
          return false;
        }
        return true;
      });

      // partículas
      s.parts.forEach((p) => {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt;
      });
      s.parts = s.parts.filter((p) => p.life > 0);

      if (!s.foes.some((f) => f.alive)) {
        s.wave++;
        spawn();
      }
    }

    const pad = (v) => String(v).padStart(3, "0");

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // estrelas
      ctx.fillStyle = "rgba(242,237,230,.18)";
      for (let i = 0; i < 40; i++) {
        const x = (i * 97.3) % W;
        const y = (i * 53.7 + s.t * (8 + (i % 3) * 6)) % H;
        ctx.fillRect(x, y, 1, 1);
      }

      // HUD
      ctx.font = "10px Silkscreen, monospace";
      ctx.textBaseline = "top";
      ctx.fillStyle = "#9a958e";
      ctx.textAlign = "left";
      ctx.fillText(`AUDITADAS ${pad(s.score)}`, 12, 12);
      ctx.textAlign = "right";
      ctx.fillText(`MULTAS ${pad(s.fines)} · ONDA ${String(s.wave).padStart(2, "0")}`, W - 12, 12);
      if (!s.hover && Math.floor(s.t * 2) % 2 === 0) {
        ctx.textAlign = "left";
        ctx.fillStyle = "#e9a46a";
        ctx.fillText("DEMO", 12, H - 18);
      }

      // inimigos
      const frame = Math.floor(s.t * 3) % 2;
      s.foes.forEach((f) => {
        if (!f.alive) return;
        const sprite = f.kind === "doc" ? SPRITES.doc : frame ? SPRITES.bugA : SPRITES.bugB;
        drawSprite(sprite, foeX(f), foeY(f), f.kind === "doc" ? "#f2ede6" : "#9a958e");
      });

      // tiros
      ctx.fillStyle = "#e9a46a";
      s.bullets.forEach((b) => ctx.fillRect(b.x - 1, b.y, 3, 9));
      ctx.fillStyle = "#d9705f";
      s.drops.forEach((d) => ctx.fillRect(d.x - 1, d.y, 3, 7));

      // partículas
      s.parts.forEach((p) => {
        ctx.fillStyle = p.life > .3 ? "#e9a46a" : "#66625c";
        ctx.fillRect(p.x, p.y, 3, 3);
      });

      // nave
      const shipColor = s.flash > 0 && Math.floor(s.flash * 20) % 2 ? "#d9705f" : "#e9a46a";
      drawSprite(SPRITES.ship, s.shipX - SW / 2, H - 34, shipColor);
    }

    function loop(now) {
      const dt = Math.min(.05, (now - last) / 1000 || 0);
      last = now;
      if (!reduceMotion || s.hover) update(dt);
      draw();
      raf = requestAnimationFrame(loop);
    }

    const start = () => {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const setX = (e) => {
      const r = canvas.getBoundingClientRect();
      s.mx = e.clientX - r.left;
    };
    canvas.addEventListener("pointermove", (e) => {
      s.hover = true;
      setX(e);
    });
    canvas.addEventListener("pointerdown", (e) => {
      s.hover = true;
      setX(e);
      shoot();
    });
    canvas.addEventListener("pointerleave", () => (s.hover = false));

    new ResizeObserver(resize).observe(canvas);
    resize();
    whileVisible(canvas, start, stop);
    if (document.fonts) document.fonts.ready.then(draw);
  })();

  /* =========================================================
     ESFERA DO INVENTÁRIO
     ========================================================= */
  (function sphere() {
    const box = $(".sphere");
    if (!box) return;
    const chips = $$(".chip");
    const names = [...new Set(chips.map((c) => c.dataset.k))];
    const N = names.length;

    // pontos distribuídos na esfera (espiral de Fibonacci)
    const golden = Math.PI * (3 - Math.sqrt(5));
    const orbs = names.map((name, i) => {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = golden * i;
      const el = document.createElement("button");
      el.type = "button";
      el.className = "orb";
      el.textContent = name;
      el.tabIndex = -1;
      box.appendChild(el);
      return { el, name, x: Math.cos(th) * r, y, z: Math.sin(th) * r };
    });

    let rx = -0.25, ry = 0, vx = 0, vy = 0.0035;
    let R = 0, raf = 0, running = false;
    let drag = null, moved = false;
    const AUTO = reduceMotion ? 0 : 0.0035;

    const size = () => (R = box.clientWidth * 0.4);
    new ResizeObserver(size).observe(box);
    size();

    function render() {
      const cx = Math.cos(rx), sx = Math.sin(rx), cy = Math.cos(ry), sy = Math.sin(ry);
      for (const o of orbs) {
        const x1 = o.x * cy - o.z * sy;
        const z1 = o.x * sy + o.z * cy;
        const y2 = o.y * cx - z1 * sx;
        const z2 = o.y * sx + z1 * cx;
        const depth = (z2 + 1) / 2; // 0 = atrás, 1 = na frente
        const scale = 0.55 + depth * 0.5;
        o.el.style.transform = `translate(-50%, -50%) translate3d(${(x1 * R).toFixed(1)}px, ${(y2 * R).toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
        o.el.style.opacity = (0.22 + depth * 0.78).toFixed(2);
        o.el.style.zIndex = Math.round(depth * 100);
      }
    }

    function tick() {
      if (!drag) {
        ry += vy;
        rx += vx;
        vx *= 0.95;
        vy += (AUTO - vy) * 0.02;
      }
      render();
      raf = requestAnimationFrame(tick);
    }

    whileVisible(
      box,
      () => {
        if (running) return;
        running = true;
        raf = requestAnimationFrame(tick);
      },
      () => {
        running = false;
        cancelAnimationFrame(raf);
      }
    );
    render();

    box.addEventListener("pointerdown", (e) => {
      drag = { x: e.clientX, y: e.clientY };
      moved = false;
      box.classList.add("is-dragging");
    });
    addEventListener("pointermove", (e) => {
      if (!drag) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (Math.abs(dx) + Math.abs(dy) > 3) moved = true;
      vy = dx * 0.006;
      vx = -dy * 0.006;
      ry += vy;
      rx += vx;
      drag = { x: e.clientX, y: e.clientY };
    });
    const end = () => {
      drag = null;
      box.classList.remove("is-dragging");
    };
    addEventListener("pointerup", end);
    addEventListener("pointercancel", end);

    // tocar num item acende o mesmo item no inventário
    let hitTimer;
    box.addEventListener("click", (e) => {
      const orb = e.target.closest(".orb");
      if (!orb || moved) return;
      clearTimeout(hitTimer);
      $$(".is-hit").forEach((el) => el.classList.remove("is-hit"));
      orb.classList.add("is-hit");
      chips.filter((c) => c.dataset.k === orb.textContent).forEach((c) => c.classList.add("is-hit"));
      hitTimer = setTimeout(() => $$(".is-hit").forEach((el) => el.classList.remove("is-hit")), 1800);
    });
  })();
})();
