(() => {
  const demos = [
    { slug: "demo-fonoaudiologia", label: "Salud Infantil" },
    { slug: "demo-psicologa", label: "Psicología" },
    { slug: "demo-salon-belleza", label: "Estética" },
    { slug: "demo-cafe-valparaiso", label: "Café" },
    { slug: "demo-artesanias", label: "Catálogo" },
    { slug: "demo-contabilidad", label: "Contabilidad" },
    { slug: "demo-propiedades", label: "Propiedades" },
    { slug: "demo-ecommerce-tech", label: "Tienda Tech" },
    { slug: "demo-agenda", label: "Agenda" },
    { slug: "demo-propuesta-empezar-simple", label: "Propuesta Editorial" },
    { slug: "demo-propuesta-impacto-comercial", label: "Propuesta Comercial" },
    { slug: "demo-propuesta-atencion-ordenada", label: "Propuesta Sistema" },
    { slug: "demo-plan-profesional", label: "Plan Profesional" },
    { slug: "demo-plan-premium", label: "Plan Premium" }
  ];

  const path = window.location.pathname;
  const currentIndex = demos.findIndex((demo) => path.includes(`/${demo.slug}/`));
  if (currentIndex === -1) return;

  const prev = demos[(currentIndex - 1 + demos.length) % demos.length];
  const next = demos[(currentIndex + 1) % demos.length];
  const current = demos[currentIndex];

  const style = document.createElement("style");
  style.textContent = `
    html {
      scroll-padding-top: 80px;
    }
    button, a, input, select, textarea, [id], section, div[role="button"], .cta-btn, .btn {
      scroll-margin-top: 80px;
    }
    .stax-demo-nav {
      position: sticky;
      top: 0;
      z-index: 100;
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      gap: 0.75rem;
      padding: 0.7rem 1rem;
      background: rgba(5, 10, 20, 0.92);
      backdrop-filter: blur(14px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .stax-demo-nav__edge,
    .stax-demo-nav__home {
      color: #e5e7eb;
      text-decoration: none;
      font-family: inherit;
    }
    .stax-demo-nav__edge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.82rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      opacity: 0.88;
      transition: opacity 0.2s ease, transform 0.2s ease;
    }
    .stax-demo-nav__edge:hover,
    .stax-demo-nav__home:hover {
      opacity: 1;
    }
    .stax-demo-nav__edge--prev:hover {
      transform: translateX(-2px);
    }
    .stax-demo-nav__edge--next:hover {
      transform: translateX(2px);
    }
    .stax-demo-nav__edge--next {
      justify-self: end;
    }
    .stax-demo-nav__home {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.55rem;
      padding: 0.62rem 1rem;
      border-radius: 999px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      background: rgba(255, 255, 255, 0.04);
      font-size: 0.82rem;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      white-space: nowrap;
    }
    .stax-demo-nav__pill {
      color: #fb7185;
    }
    .stax-demo-nav__muted {
      opacity: 0.58;
    }
    @media (max-width: 640px) {
      .stax-demo-nav {
        grid-template-columns: 44px 1fr 44px;
        gap: 0.5rem;
        padding: 0.6rem 0.75rem;
      }
      .stax-demo-nav__edge span,
      .stax-demo-nav__home .stax-demo-nav__muted {
        display: none;
      }
      .stax-demo-nav__edge {
        justify-content: center;
        font-size: 1.15rem;
        letter-spacing: 0;
      }
      .stax-demo-nav__home {
        width: 100%;
        padding: 0.62rem 0.8rem;
        font-size: 0.74rem;
        letter-spacing: 0.1em;
      }
    }
  `;
  document.head.appendChild(style);

  const nav = document.createElement("div");
  nav.className = "stax-demo-nav";
  nav.innerHTML = `
    <a class="stax-demo-nav__edge stax-demo-nav__edge--prev" href="../${prev.slug}/index.html" aria-label="Ir al demo anterior: ${prev.label}">
      <strong>&larr;</strong><span>${prev.label}</span>
    </a>
    <a class="stax-demo-nav__home" href="../index.html#demos" aria-label="Volver al portafolio STAX">
      <span class="stax-demo-nav__pill">STAX</span>
      <span class="stax-demo-nav__muted">/</span>
      <span>${current.label}</span>
    </a>
    <a class="stax-demo-nav__edge stax-demo-nav__edge--next" href="../${next.slug}/index.html" aria-label="Ir al siguiente demo: ${next.label}">
      <span>${next.label}</span><strong>&rarr;</strong>
    </a>
  `;

  document.body.insertBefore(nav, document.body.firstChild);
})();
