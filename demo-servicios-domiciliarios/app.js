const HOGAR_STORAGE_KEY = "stax-demo-hogar";

const HOGAR_SEED = {
  requests: [
    {
      id: 1,
      commune: "Ñuñoa",
      service: "Gasfitería",
      urgency: "Hoy",
      schedule: "15:00–18:00",
      detail: "Revisar filtración bajo lavaplatos.",
      status: "Por revisar",
    },
    {
      id: 2,
      commune: "Macul",
      service: "Mantención",
      urgency: "Esta semana",
      schedule: "09:00–12:00",
      detail: "Mantención preventiva de calefón.",
      status: "Coordinando",
    },
  ],
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function readState() {
  try {
    return JSON.parse(localStorage.getItem(HOGAR_STORAGE_KEY)) || clone(HOGAR_SEED);
  } catch {
    return clone(HOGAR_SEED);
  }
}

function serviciosDomiciliariosApp() {
  const state = readState();

  return {
    storageKey: HOGAR_STORAGE_KEY,
    requests: state.requests,
    modalOpen: false,
    confirmation: "",
    draft: {
      commune: "",
      service: "Gasfitería",
      urgency: "Hoy",
      schedule: "09:00–12:00",
      detail: "",
    },
    persist() {
      localStorage.setItem(this.storageKey, JSON.stringify({ requests: this.requests }));
    },
    resetDraft() {
      this.draft = { commune: "", service: "Gasfitería", urgency: "Hoy", schedule: "09:00–12:00", detail: "" };
    },
    closeModal() {
      this.modalOpen = false;
      this.resetDraft();
    },
    saveRequest() {
      const request = {
        id: Date.now(),
        ...this.draft,
        status: "Por revisar",
      };
      this.requests.unshift(request);
      this.persist();
      this.confirmation = `Solicitud lista: ${request.commune} · ${request.service}.`;
      this.closeModal();
    },
    resetDemo() {
      localStorage.removeItem(this.storageKey);
      this.requests = clone(HOGAR_SEED).requests;
      this.confirmation = "La demo volvió a sus solicitudes iniciales.";
    },
    statusClass(status) {
      return { "Por revisar": "status-coral", Coordinando: "status-sun", Confirmado: "status-mint" }[status] || "status-ink";
    },
    whatsappHref(request) {
      const text = `Hola, quiero coordinar ${request.service} en ${request.commune}. Urgencia: ${request.urgency}. ${request.detail}`;
      return `https://wa.me/56999040515?text=${encodeURIComponent(text)}`;
    },
  };
}
