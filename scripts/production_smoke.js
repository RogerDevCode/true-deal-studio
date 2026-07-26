#!/usr/bin/env node

const PROD_URL = "https://true-deal-studio.vercel.app/";
const PAGES = [
  { path: "", expectedTitle: "STAX | Que te vean. Que te crean." },
  { path: "privacidad.html", expectedTitle: "STAX | Aviso de Privacidad" },
  { path: "demo-agenda/index.html", expectedTitle: "CRM Express | Panel de Control de Agenda y Clientes Demo" },
  { path: "demo-artesanias/index.html", expectedTitle: "Artesanías del Sur | Catálogo & Tienda Online - Chile" },
  { path: "demo-cafe-valparaiso/index.html", expectedTitle: "Café La Ruta | Cafetería de Especialidad & Almuerzos - Valparaíso" },
  { path: "demo-psicologa/index.html", expectedTitle: "Ps. Clara Altieri | Psicología Clínica & Bienestar Emocional" },
  { path: "demo-contabilidad/index.html", expectedTitle: "ContaDigital | Asesoría Contable & Tributaria para Pymes - Santiago" },
  { path: "demo-ecommerce-tech/index.html", expectedTitle: "Apex Tech | Tienda Online & Panel de Administración Demo" },
  { path: "demo-fonoaudiologia/index.html", expectedTitle: "Nahovy Gallegos | Fonoaudiología Infantil a Domicilio en Santiago" },
  { path: "demo-plan-premium/index.html", expectedTitle: "Muebles Roble | Demo Plan Premium" },
  { path: "demo-plan-profesional/index.html", expectedTitle: "Remodelaciones Altiplano | Demo Plan Profesional" },
  { path: "demo-propiedades/index.html", expectedTitle: "Cobre & Co. Propiedades — Corretaje Inmobiliario Premium" },
  { path: "demo-propuesta-atencion-ordenada/index.html", expectedTitle: "Sistema Vivo | Propuesta STAX" },
  { path: "demo-propuesta-empezar-simple/index.html", expectedTitle: "Editorial Boutique Viva | Propuesta STAX" },
  { path: "demo-propuesta-impacto-comercial/index.html", expectedTitle: "Impacto Comercial Vivo | Propuesta STAX" },
  { path: "demo-salon-belleza/index.html", expectedTitle: "Studio Chic | Salón de Alta Peluquería & Estilo - Santiago" },
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function findTag(content, regex, label) {
  assert(regex.test(content), `Falta ${label}`);
}

async function fetchText(url, fetchImpl = fetch) {
  const response = await fetchImpl(url, {
    headers: {
      "user-agent": "true-deal-studio-production-smoke/1.0",
    },
  });
  assert(response.ok, `HTTP ${response.status} en ${url}`);
  return {
    headers: response.headers,
    text: await response.text(),
  };
}

async function run(fetchImpl = fetch, log = console.log) {
  for (const page of PAGES) {
    const url = new URL(page.path, PROD_URL).toString();
    const { headers, text } = await fetchText(url, fetchImpl);

    assert(text.includes(page.expectedTitle), `Titulo inesperado en ${url}`);
    findTag(text, /<html\b[^>]*lang=["']es-CL["']/i, "lang es-CL");
    findTag(text, /<h1\b/i, "<h1>");
    findTag(text, /<meta\b[^>]*property=["']og:title["']/i, "og:title");
    findTag(text, /<meta\b[^>]*property=["']og:description["']/i, "og:description");
    findTag(text, /<meta\b[^>]*property=["']og:image["']/i, "og:image");
    findTag(text, /<meta\b[^>]*name=["']twitter:card["'][^>]*summary_large_image/i, "twitter:card");
    findTag(text, /<script\b[^>]*type=["']application\/ld\+json["']/i, "application/ld+json");

    const cacheControl = headers.get("cache-control") || "";
    assert(cacheControl.length > 0, `Cache-Control ausente en ${url}`);
    log(`PASS ${url}`);
  }
}

module.exports = { PROD_URL, PAGES, run };

if (require.main === module) {
  run().catch((error) => {
    console.error(`FAIL ${error.message}`);
    process.exitCode = 1;
  });
}
