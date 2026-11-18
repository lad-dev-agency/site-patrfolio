/* =========================================================
   LAD — landing interactions (vanilla JS, no dependencies)
   ========================================================= */
(function () {
  "use strict";

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Year ---------- */
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Header on scroll ---------- */
  const header = $("#header");
  const onScrollHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 30);
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  /* ---------- Active nav link ---------- */
  const navLinks = $$(".nav a");
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + e.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  navLinks.forEach((a) => {
    const target = $(a.getAttribute("href"));
    if (target) sectionObserver.observe(target);
  });

  /* ---------- Mobile menu ---------- */
  const burger = $(".burger");
  const menu = $("#mobile-menu");
  const setMenu = (open) => {
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Закрити меню" : "Відкрити меню");
    menu.classList.toggle("is-open", open);
    menu.setAttribute("aria-hidden", String(!open));
    document.body.classList.toggle("no-scroll", open);
  };
  burger.addEventListener("click", () => setMenu(burger.getAttribute("aria-expanded") !== "true"));
  $$("a", menu).forEach((a) => a.addEventListener("click", () => setMenu(false)));

  /* ---------- Split text into chars ---------- */
  $$(".split").forEach((el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.setAttribute("aria-label", el.textContent.trim());
    el.textContent = "";
    let i = 0;
    words.forEach((word, wi) => {
      const w = document.createElement("span");
      w.className = "word";
      w.setAttribute("aria-hidden", "true");
      for (const ch of word) {
        const c = document.createElement("span");
        c.className = "char";
        c.textContent = ch;
        c.style.setProperty("--i", i++);
        w.appendChild(c);
      }
      el.appendChild(w);
      if (wi < words.length - 1) el.appendChild(document.createTextNode(" "));
    });
  });
  // second hero line starts a bit later
  const lines = $$(".hero__title .line");
  if (lines[1]) lines[1].style.setProperty("--d", "250ms");

  // gradient continuity across separately-animated chars
  const paintGradients = () => {
    $$(".split").forEach((el) => {
      const chars = $$(".char", el);
      if (!chars.length) return;
      // group by visual row (offsetTop) so wrapped lines get their own gradient
      const rows = new Map();
      chars.forEach((c) => {
        const key = c.offsetTop;
        if (!rows.has(key)) rows.set(key, []);
        rows.get(key).push(c);
      });
      rows.forEach((row) => {
        const left = Math.min(...row.map((c) => c.offsetLeft));
        const right = Math.max(...row.map((c) => c.offsetLeft + c.offsetWidth));
        row.forEach((c) => {
          c.style.setProperty("--w", right - left + "px");
          c.style.setProperty("--x", left - c.offsetLeft + "px");
        });
      });
    });
  };

  const start = () => {
    paintGradients();
    requestAnimationFrame(() => document.body.classList.add("is-loaded"));
  };
  if (document.fonts && document.fonts.ready) {
    Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1200))]).then(start);
  } else {
    window.addEventListener("load", start);
  }
  window.addEventListener("resize", debounce(paintGradients, 150));

  /* ---------- Reveal on scroll ---------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      revealObserver.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

  const observeReveal = (el) => {
    const d = Number(el.dataset.delay || 0);
    if (d) el.style.transitionDelay = d * 0.1 + "s";
    revealObserver.observe(el);
  };
  $$(".reveal, .footer__giant").forEach(observeReveal);

  /* ---------- Counters ---------- */
  const animateCount = (el) => {
    const target = Number(el.dataset.count);
    if (reduceMotion) { el.textContent = target; return; }
    const dur = 1800;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      animateCount(e.target);
      countObserver.unobserve(e.target);
    });
  }, { threshold: 0.6 });
  $$("[data-count]").forEach((el) => countObserver.observe(el));

  /* ---------- Hero parallax ---------- */
  const heroVisual = $(".hero-visual");
  if (heroVisual && finePointer && !reduceMotion) {
    const layers = $$(".hv__layer", heroVisual);
    window.addEventListener("pointermove", (e) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      layers.forEach((l) => {
        const d = Number(l.dataset.depth);
        l.style.transform = `translate3d(${x * 40 * d}px, ${y * 40 * d}px, 0)`;
      });
    }, { passive: true });
  }

  /* ---------- Custom cursor + magnetic buttons ---------- */
  if (finePointer && !reduceMotion) {
    const cursor = $(".cursor");
    let cx = 0, cy = 0, tx = 0, ty = 0;
    window.addEventListener("pointermove", (e) => {
      tx = e.clientX; ty = e.clientY;
      cursor.classList.add("is-visible");
    }, { passive: true });
    document.addEventListener("pointerleave", () => cursor.classList.remove("is-visible"));
    const loop = () => {
      cx += (tx - cx) * 0.2;
      cy += (ty - cy) * 0.2;
      cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      requestAnimationFrame(loop);
    };
    loop();

    document.addEventListener("pointerover", (e) => {
      if (e.target.closest("a, button, .work, label")) cursor.classList.add("is-hover");
    });
    document.addEventListener("pointerout", (e) => {
      if (e.target.closest("a, button, .work, label")) cursor.classList.remove("is-hover");
    });

    $$(".magnetic").forEach((btn) => {
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      btn.addEventListener("pointerleave", () => { btn.style.transform = ""; });
    });
  }

  /* =========================================================
     Portfolio
     ========================================================= */
  const projects = window.LAD_PROJECTS || [];
  const works = $("#works");

  const esc = (s) => String(s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));

  const mocks = {
    phone: () => `
      <div class="ph ph--2"><i class="ph__bal"></i><div class="ph__bars"><i style="height:40%"></i><i style="height:70%"></i><i style="height:55%"></i><i style="height:90%"></i><i style="height:60%"></i></div><i class="ph__row"></i><i class="ph__row"></i></div>
      <div class="ph ph--1"><i class="ph__bal"></i><div class="ph__bars"><i style="height:50%"></i><i style="height:80%"></i><i style="height:35%"></i><i style="height:95%"></i><i style="height:65%"></i><i style="height:75%"></i></div><i class="ph__row"></i><i class="ph__row"></i></div>`,
    browser: () => `
      <div class="br"><i class="br__bar"></i><i class="br__hero"></i><div class="br__grid"><i></i><i></i><i></i><i></i><i></i><i></i></div></div>`,
    chat: () => `
      <div class="ch">
        <b class="me">Хочу записатися до кардіолога</b>
        <b>✦ Є вільний час завтра о 10:30 або 14:00. Що зручніше?</b>
        <b class="me">10:30 👍</b>
        <b class="typing"><span></span></b>
      </div>`,
    map: () => `
      <i class="mp"></i>
      <svg viewBox="0 0 300 160" preserveAspectRatio="xMidYMid meet"><path d="M20 130 C 80 40, 140 150, 200 70 S 270 30, 285 20"/><circle cx="20" cy="130" r="8"/><circle cx="200" cy="70" r="6"/><circle cx="285" cy="20" r="8"/></svg>
      <span class="truck">🚚 Київ → Варшава</span>`,
    brand: (p) => `
      <div class="bd-logo"><div><span>1890</span><small>KAVARNIA</small></div></div>
      <i class="bd-cup"></i>
      <div class="bd-sw"><i style="background:${p.colors[0]}"></i><i style="background:${p.colors[1]}"></i><i style="background:#f1e3cf"></i></div>`,
    dashboard: () => `
      <div class="db">
        <i class="db__side"></i>
        <i class="db__kpi" data-v="$1.2M"></i><i class="db__kpi" data-v="+38%"></i><i class="db__kpi" data-v="4 820"></i>
        <div class="db__chart">${[40, 65, 50, 80, 60, 90, 70, 95, 75, 85, 60, 100].map((h) => `<i style="height:${h}%"></i>`).join("")}</div>
      </div>`,
    cloud: () => `
      <svg viewBox="0 0 400 180" preserveAspectRatio="xMidYMid meet">
        <line x1="200" y1="90" x2="70" y2="40"/><line x1="200" y1="90" x2="70" y2="140"/><line x1="200" y1="90" x2="330" y2="40"/><line x1="200" y1="90" x2="330" y2="140"/>
        <rect x="20" y="22" width="100" height="36" rx="10"/><text x="38" y="45">Docker</text>
        <rect x="20" y="122" width="100" height="36" rx="10"/><text x="34" y="145">GitLab CI</text>
        <rect x="280" y="22" width="100" height="36" rx="10"/><text x="300" y="45">Grafana</text>
        <rect x="280" y="122" width="100" height="36" rx="10"/><text x="292" y="145">Terraform</text>
        <rect class="hub" x="150" y="68" width="100" height="44" rx="22"/><text class="dark" x="182" y="95">AWS</text>
      </svg>`
  };

  const cover = (p) => p.cover
    ? `<div class="work__cover work__cover--img"><img class="work__shot work__shot--${esc(p.id)}" src="${esc(p.cover)}" alt="" loading="lazy" decoding="async"></div>`
    : `<div class="work__cover"><div class="mock mock--${p.mock}">${(mocks[p.mock] || (() => ""))(p)}</div></div>`;

  const gallery = (p) => (p.gallery || []).length
    ? `<div class="modal__gallery" style="--c1:${p.colors[0]};--c2:${p.colors[1]}">${p.gallery.map((g) => `<figure><img src="${esc(g.src)}" alt="${esc(g.alt || p.title)}" loading="lazy" decoding="async"></figure>`).join("")}</div>`
    : "";

  works.innerHTML = projects.map((p) => `
    <article class="work ${p.size ? "work--" + p.size : ""} reveal" data-id="${esc(p.id)}" data-cat="${esc(p.category.join(" "))}"
      style="--c1:${p.colors[0]};--c2:${p.colors[1]}" tabindex="0" role="button" aria-label="Відкрити кейс ${esc(p.title)}">
      ${cover(p)}
      <div class="work__info">
        <div class="work__meta"><span>${esc(p.industry)}</span><span class="work__result">${esc(p.result)}</span></div>
        <h3>${esc(p.title)}</h3>
        <ul class="work__tags">${p.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
      </div>
      <span class="work__open" aria-hidden="true">↗</span>
    </article>`).join("");
  $$(".work", works).forEach(observeReveal);

  /* filter */
  const filters = $$(".filter");
  filters.forEach((btn) => btn.addEventListener("click", () => {
    const f = btn.dataset.filter;
    filters.forEach((b) => {
      const on = b === btn;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-selected", String(on));
    });
    $$(".work", works).forEach((card) => {
      const show = f === "all" || card.dataset.cat.split(" ").includes(f);
      const wasHidden = card.classList.contains("is-hidden");
      card.classList.toggle("is-hidden", !show);
      card.classList.add("in");
      if (show && wasHidden) {
        card.classList.remove("is-entering");
        void card.offsetWidth;
        card.classList.add("is-entering");
      }
    });
  }));

  /* tilt */
  if (finePointer && !reduceMotion) {
    $$(".work", works).forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty("--ry", x * 8 + "deg");
        card.style.setProperty("--rx", -y * 8 + "deg");
      });
      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--ry", "0deg");
        card.style.setProperty("--rx", "0deg");
      });
    });
  }

  /* modal */
  const modal = $("#modal");
  const modalContent = $("#modal-content");
  let lastFocus = null;

  const openModal = (id) => {
    const p = projects.find((x) => x.id === id);
    if (!p) return;
    lastFocus = document.activeElement;
    modalContent.innerHTML = `
      <div class="modal__cover" style="--c1:${p.colors[0]};--c2:${p.colors[1]}">${cover(p)}</div>
      <div class="modal__body">
        <div class="work__meta"><span>${esc(p.industry)}</span>${p.tags.map((t) => `<span class="work__result">${esc(t)}</span>`).join("")}</div>
        <h2 id="modal-title">${esc(p.title)}</h2>
        <div class="modal__metrics">${p.metrics.map((m) => `<div><strong>${esc(m.value)}</strong><span>${esc(m.label)}</span></div>`).join("")}</div>
        <div class="modal__cols">
          <div><h4>Клієнт</h4><p>${esc(p.about)}</p></div>
          <div><h4>Задача</h4><p>${esc(p.task)}</p></div>
          <div><h4>Рішення</h4><p>${esc(p.solution)}</p></div>
        </div>
        ${gallery(p)}
        <div class="modal__stack">${p.stack.map((s) => `<span>${esc(s)}</span>`).join("")}</div>
        <a href="#contact" class="btn btn--primary modal__cta" data-close>Хочу такий самий результат <span class="arrow">↗</span></a>
      </div>`;
    modal.hidden = false;
    modal.classList.remove("is-closing");
    document.body.classList.add("no-scroll");
    $(".modal__close", modal).focus();
  };

  const closeModal = () => {
    if (modal.hidden) return;
    modal.classList.add("is-closing");
    setTimeout(() => {
      modal.hidden = true;
      modal.classList.remove("is-closing");
      document.body.classList.remove("no-scroll");
      if (lastFocus) lastFocus.focus({ preventScroll: true });
    }, reduceMotion ? 0 : 340);
  };

  works.addEventListener("click", (e) => {
    const card = e.target.closest(".work");
    if (card) openModal(card.dataset.id);
  });
  works.addEventListener("keydown", (e) => {
    const card = e.target.closest(".work");
    if (card && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openModal(card.dataset.id); }
  });
  modal.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) closeModal(); });
  document.addEventListener("keydown", (e) => {
    if (modal.hidden) {
      if (e.key === "Escape" && menu.classList.contains("is-open")) setMenu(false);
      return;
    }
    if (e.key === "Escape") closeModal();
    if (e.key === "Tab") {
      const f = $$("a, button", modal.querySelector(".modal__dialog"));
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- Process line ---------- */
  const stepsWrap = $(".steps-wrap");
  const steps = $$(".step");
  const fill = $(".steps__fill");
  const onScrollSteps = () => {
    if (!stepsWrap) return;
    const r = stepsWrap.getBoundingClientRect();
    const vh = window.innerHeight;
    const p = Math.min(Math.max((vh * 0.75 - r.top) / (r.height + vh * 0.25), 0), 1);
    fill.style.setProperty("--p", p.toFixed(3));
    steps.forEach((s, i) => s.classList.toggle("is-done", p >= (i + 0.5) / steps.length || p >= 0.98));
  };
  onScrollSteps();
  window.addEventListener("scroll", onScrollSteps, { passive: true });

  /* ---------- Reviews slider ---------- */
  const slider = $("#slider");
  if (slider) {
    const step = () => {
      const card = $(".review", slider);
      return card ? card.getBoundingClientRect().width + 22 : 400;
    };
    const go = (dir) => {
      const max = slider.scrollWidth - slider.clientWidth - 2;
      if (dir > 0 && slider.scrollLeft >= max) slider.scrollTo({ left: 0, behavior: "smooth" });
      else slider.scrollBy({ left: dir * step(), behavior: "smooth" });
    };
    $$(".slider-nav .round-btn").forEach((b) => b.addEventListener("click", () => { go(Number(b.dataset.dir)); restart(); }));

    // drag to scroll (mouse)
    let down = false, startX = 0, startLeft = 0, moved = false;
    slider.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse") return;
      down = true; moved = false; startX = e.clientX; startLeft = slider.scrollLeft;
    });
    window.addEventListener("pointermove", (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) { moved = true; slider.classList.add("is-dragging"); }
      slider.scrollLeft = startLeft - dx;
    });
    window.addEventListener("pointerup", () => {
      if (!down) return;
      down = false;
      slider.classList.remove("is-dragging");
      if (moved) restart();
    });

    // autoplay
    let timer = null;
    const restart = () => {
      clearInterval(timer);
      if (!reduceMotion) timer = setInterval(() => go(1), 5000);
    };
    slider.addEventListener("pointerenter", () => clearInterval(timer));
    slider.addEventListener("pointerleave", restart);
    restart();
  }

  /* ---------- Contact form ----------
     Заявки надсилаються листом на пошту через Web3Forms (https://web3forms.com, безкоштовно до 250 заявок/міс).
     Ключ отримується на сайті Web3Forms: вводите пошту, на яку мають приходити заявки, і ключ приходить листом.
     Вставте його в FORM_KEY нижче. Ключ публічний за задумом — його можна тримати у фронтенді. */
  const FORM_ENDPOINT = "https://api.web3forms.com/submit";
  const FORM_KEY = "YOUR_WEB3FORMS_ACCESS_KEY";
  const FALLBACK_EMAIL = "lad.devagency@gmail.com";
  const SERVICE_LABELS = { web: "Веб-сайт", mobile: "Застосунок", design: "UI/UX", ai: "AI / боти", devops: "DevOps" };

  const form = $("#contact-form");
  if (form) {
    const required = $$("[required]", form);
    const submitBtn = $('button[type="submit"]', form);
    const errorBox = $(".form__error", form);
    required.forEach((inp) => inp.addEventListener("input", () => inp.closest(".field").classList.remove("has-error")));

    const showError = (show) => { if (errorBox) errorBox.hidden = !show; };
    const setSending = (on) => {
      submitBtn.disabled = on;
      submitBtn.classList.toggle("is-loading", on);
      submitBtn.firstChild.textContent = on ? "Надсилаємо… " : "Надіслати заявку ";
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      showError(false);
      let ok = true;
      required.forEach((inp) => {
        const bad = !inp.value.trim();
        inp.closest(".field").classList.toggle("has-error", bad);
        if (bad && ok) { inp.focus(); ok = false; }
      });
      if (!ok) return;

      const fd = new FormData(form);
      const name = String(fd.get("name") || "").trim();
      const contact = String(fd.get("contact") || "").trim();
      const services = $$('input[name="service"]:checked', form).map((i) => SERVICE_LABELS[i.value] || i.value);

      // Порядок полів = порядок рядків у листі
      const payload = {
        access_key: FORM_KEY,
        subject: `Нова заявка з сайту LAD — ${name}`,
        from_name: "Сайт LAD",
        "Ім'я": name,
        "Контакт": contact,
        "Що цікавить": services.length ? services.join(", ") : "—",
        "Бюджет": fd.get("budget") || "Не визначився",
        "Про проєкт": String(fd.get("message") || "").trim() || "—",
        botcheck: fd.get("botcheck") ? true : ""
      };
      // Якщо клієнт залишив email — кнопка «Відповісти» в пошті одразу відповідатиме йому
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) payload.replyto = contact;

      setSending(true);
      try {
        if (FORM_KEY.startsWith("YOUR_")) throw new Error("Web3Forms key is not set");
        const res = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload)
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || !json.success) throw new Error(json.message || `HTTP ${res.status}`);

        form.classList.add("is-sent");
        $(".form__success", form).hidden = false;
        form.reset();
      } catch (err) {
        console.error("LAD form:", err);
        // Запасний варіант: готовий лист у поштовому клієнті, щоб заявка не загубилась
        const body = [`Ім'я: ${name}`, `Контакт: ${contact}`, `Що цікавить: ${payload["Що цікавить"]}`, `Бюджет: ${payload["Бюджет"]}`, "", payload["Про проєкт"]].join("\n");
        const link = errorBox && $("a", errorBox);
        if (link) link.href = `mailto:${FALLBACK_EMAIL}?subject=${encodeURIComponent(payload.subject)}&body=${encodeURIComponent(body)}`;
        showError(true);
      } finally {
        setSending(false);
      }
    });
  }

  /* ---------- utils ---------- */
  function debounce(fn, ms) {
    let t;
    return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
  }
})();
