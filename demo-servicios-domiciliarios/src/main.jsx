import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

const key = "stax-demo-hogar";
const photos = [
  ["Electricidad", "Diagnóstico y reparación segura", "../assets/optimized/ecommerce-card.webp"],
  ["Gasfitería", "Filtraciones y conexiones con contexto", "../assets/optimized/contabilidad-card.webp"],
  ["Mantención", "Prevención antes de la urgencia", "../assets/optimized/propiedades-card.webp"],
  ["Visita coordinada", "Comuna, franja y detalle antes de responder", "../assets/optimized/santiago-hero.webp"],
];
const seed = [{ id: 1, commune: "Ñuñoa", service: "Gasfitería", urgency: "Hoy", schedule: "15:00–18:00", detail: "Revisar filtración bajo lavaplatos.", status: "Por revisar" }];
const empty = () => ({ commune: "", service: "Electricidad", urgency: "Hoy", schedule: "09:00–12:00", detail: "" });

function App() {
  const [requests, setRequests] = useState(() => { try { return JSON.parse(localStorage.getItem(key))?.requests || seed; } catch { return seed; } });
  const [draft, setDraft] = useState(empty()); const [open, setOpen] = useState(false);
  useEffect(() => localStorage.setItem(key, JSON.stringify({ requests })), [requests]);
  const field = (name, label, options) => <label>{label}{options ? <select value={draft[name]} onChange={e => setDraft({ ...draft, [name]: e.target.value })}>{options.map(x => <option key={x}>{x}</option>)}</select> : <input required value={draft[name]} onChange={e => setDraft({ ...draft, [name]: e.target.value })} />}</label>;
  return <><header><b>RUTA CASA</b><button onClick={() => { localStorage.removeItem(key); setRequests(seed); }}>Restablecer demo</button></header><main><section className="hero"><div><small>Servicios a domicilio · Santiago</small><h1>Resuelve lo urgente.<br/><em>Ordena lo importante.</em></h1><p>Una visita llega con comuna, urgencia y detalle antes de abrir WhatsApp.</p><button onClick={() => setOpen(true)}>Solicitar visita</button></div><img src="../assets/optimized/santiago-hero.webp" alt="Visita de servicio coordinada"/></section><section><small>Muestra fotográfica</small><h2>Servicios que se entienden antes de preguntar.</h2><div className="photos">{photos.map(([name, text, image]) => <article key={name}><img src={image} alt={name}/><h3>{name}</h3><p>{text}</p><button onClick={() => { setDraft({ ...empty(), service: name }); setOpen(true); }}>Solicitar {name}</button></article>)}</div></section><section><h2>Bitácora de solicitudes</h2>{requests.map(r => <article className="request" key={r.id}><h3>{r.commune} · {r.service}</h3><span>{r.urgency} · {r.schedule}</span><p>{r.detail}</p></article>)}</section></main>{open && <div className="modal" role="dialog" aria-modal="true"><form onSubmit={e => { e.preventDefault(); setRequests([{ id: Date.now(), ...draft, status: "Por revisar" }, ...requests]); setOpen(false); setDraft(empty()); }}><h2>Coordinar visita</h2>{field("commune", "Comuna", ["", "Ñuñoa", "Macul", "La Florida", "Providencia"])}{field("service", "Servicio", ["Electricidad", "Gasfitería", "Mantención", "Visita coordinada"])}{field("urgency", "Urgencia", ["Hoy", "Esta semana", "Planificada"])}{field("schedule", "Franja horaria", ["09:00–12:00", "12:00–15:00", "15:00–18:00"])}<label>Cuéntanos qué ocurre<textarea required value={draft.detail} onChange={e => setDraft({ ...draft, detail: e.target.value })}/></label><button type="button" onClick={() => setOpen(false)}>Cancelar</button><button>Guardar solicitud</button></form></div>}</>;
}
createRoot(document.getElementById("root")).render(<App />);
