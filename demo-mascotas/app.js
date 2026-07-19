const NIDO_STORAGE_KEY = "stax-demo-nido-animal";

document.addEventListener("DOMContentLoaded", () => {
  const methodPhotos = [
    ["./recepcion.png", "Cuidadora recibiendo a una mascota al llegar al estudio"],
    ["./bano-consciente.png", "Cuidadora realizando una rutina de baño tranquila"],
    ["./entrega.png", "Cuidadora entregando una mascota a su familia con contexto"],
  ];
  document.querySelectorAll(".mosaic img").forEach((image, index) => {
    const [src, alt] = methodPhotos[index];
    image.src = src;
    image.alt = alt;
  });
});

const NIDO_SERVICES = [
  {
    name: "Baño consciente",
    duration: "75 min",
    price: "$32.000 desde",
    image: "./bano-consciente.png",
    alt: "Gato recibiendo un baño tranquilo con una cuidadora",
    className: "service-bath",
    description: "Lavado, secado con pausa y una rutina adaptada a su pelaje.",
  },
  {
    name: "Peluquería de raza",
    duration: "90 min",
    price: "$39.000 desde",
    image: "./peluqueria-raza.png",
    alt: "Peluquera recortando cuidadosamente el pelaje de un perro pequeño",
    className: "service-groom",
    description: "Corte, cepillado y terminaciones según su pelo y rutina.",
  },
  {
    name: "Paseo individual",
    duration: "50 min",
    price: "$18.000 desde",
    image: "./paseo-individual.png",
    alt: "Cuidadora paseando individualmente a un perro por un sendero verde",
    className: "service-walk",
    description: "Un recorrido individual para caminar con atención y sin apuro.",
  },
  {
    name: "Hotel de día",
    duration: "Jornada completa",
    price: "$28.000 desde",
    image: "./hotel-dia.png",
    alt: "Perros descansando en una sala luminosa de hotel de día",
    className: "service-daycare",
    description: "Descanso, acompañamiento y actualizaciones durante su día.",
  },
];

function emptyBooking() {
  return { petName: "", species: "Perro", service: "", date: "", time: "", note: "" };
}

function readNidoState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(NIDO_STORAGE_KEY));
    return parsed && typeof parsed === "object" ? parsed : { booking: null };
  } catch {
    return { booking: null };
  }
}

function nidoAnimalApp() {
  const state = readNidoState();

  return {
    services: NIDO_SERVICES,
    booking: state.booking || null,
    draft: emptyBooking(),
    selectedService: null,
    bookingOpen: false,
    openBooking(service) {
      this.selectedService = service;
      this.draft.service = service.name;
      this.bookingOpen = true;
    },
    closeBooking() {
      this.bookingOpen = false;
      this.selectedService = null;
      this.draft = emptyBooking();
    },
    saveBooking() {
      this.booking = { id: Date.now(), ...this.draft };
      localStorage.setItem(NIDO_STORAGE_KEY, JSON.stringify({ booking: this.booking }));
      this.closeBooking();
    },
    resetDemo() {
      localStorage.removeItem(NIDO_STORAGE_KEY);
      this.booking = null;
      this.closeBooking();
    },
  };
}
