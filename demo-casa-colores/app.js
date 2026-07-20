window.casaColoresApp = () => ({
  selectedPackage: null,
  sent: false,
  packages: [
    { name: "Explora", age: "5 a 8 años", duration: "2 horas", guests: "Hasta 12 niños", price: "$149.000" },
    { name: "Crea", age: "7 a 12 años", duration: "3 horas", guests: "Hasta 18 niños", price: "$189.000" },
    { name: "Celebra", age: "10 a 15 años", duration: "3 horas", guests: "Hasta 24 invitados", price: "$239.000" },
  ],
  draft: { name: "", age: "", guests: "", date: "" },
  choosePackage(plan) {
    this.selectedPackage = plan;
    this.sent = false;
    document.getElementById("reserva")?.scrollIntoView({ behavior: "smooth", block: "start" });
  },
  resetDemo() {
    this.selectedPackage = null;
    this.sent = false;
    this.draft = { name: "", age: "", guests: "", date: "" };
    localStorage.removeItem("stax-demo-casa-colores");
  },
  submitReservation() {
    const plan = this.selectedPackage;
    const message = `Hola, soy ${this.draft.name}. Quiero consultar por el paquete ${plan.name} para una celebración de ${this.draft.age} años, con ${this.draft.guests} asistentes, idealmente el ${this.draft.date}.`;
    const url = `https://wa.me/56999040515?text=${encodeURIComponent(message)}`;
    localStorage.setItem("stax-demo-casa-colores", JSON.stringify({ plan: plan.name, ...this.draft }));
    const opened = window.openWhatsAppWithFallback ? window.openWhatsAppWithFallback(url) : !!window.open(url, "_blank");
    if (opened) this.sent = true;
  },
});
