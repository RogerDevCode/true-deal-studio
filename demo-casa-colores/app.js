window.casaRondaApp = () => ({
  selectedPackage: null,
  sent: false,
  packages: [
    {
      name: "Ronda Pequeña",
      age: "4 a 7 años",
      duration: "2 horas",
      guests: "Hasta 12 niños",
      price: "$149.000",
      situation: "Un cumpleaños tranquilo con su grupo más cercano",
      tone: "small",
    },
    {
      name: "Manos a la Obra",
      age: "6 a 10 años",
      duration: "3 horas",
      guests: "Hasta 18 niños",
      price: "$189.000",
      situation: "Juego, materiales y una creación para llevar",
      tone: "create",
    },
    {
      name: "La Gran Ronda",
      age: "7 a 10 años",
      duration: "3 horas",
      guests: "Hasta 24 invitados",
      price: "$239.000",
      situation: "Más invitados y varios momentos para compartir",
      tone: "large",
    },
  ],
  draft: { name: "", age: "", guests: "", date: "", needs: "" },
  choosePackage(plan) {
    this.selectedPackage = plan;
    this.sent = false;
    document.getElementById("reserva")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
  },
  resetDemo() {
    this.selectedPackage = null;
    this.sent = false;
    this.draft = { name: "", age: "", guests: "", date: "", needs: "" };
    localStorage.removeItem("stax-demo-casa-ronda");
    localStorage.removeItem("stax-demo-casa-colores");
  },
  submitReservation() {
    const plan = this.selectedPackage;
    const needLine = this.draft.needs.trim()
      ? ` Necesitamos conversar: ${this.draft.needs.trim()}.`
      : "";
    const message = `Hola, soy ${this.draft.name}. Quiero consultar por ${plan.name} para un cumpleaños de ${this.draft.age} años, con ${this.draft.guests} asistentes, idealmente el ${this.draft.date}.${needLine}`;
    const url = `https://wa.me/56999040515?text=${encodeURIComponent(message)}`;
    localStorage.setItem("stax-demo-casa-ronda", JSON.stringify({ plan: plan.name, ...this.draft }));
    const opened = window.openWhatsAppWithFallback
      ? window.openWhatsAppWithFallback(url)
      : !!window.open(url, "_blank");
    if (opened) this.sent = true;
  },
});

window.casaColoresApp = window.casaRondaApp;
