window.cafeApp = function cafeApp() {
  const bookingStorageKey = 'tuwebpro_bookings';

  function createBookingId() {
    return 'B-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
  }

  function saveBooking(entry) {
    try {
      const bookings = JSON.parse(localStorage.getItem(bookingStorageKey) || '[]');
      bookings.push({ ...entry, id: createBookingId(), status: 'pendiente', dateAdded: new Date().toISOString() });
      localStorage.setItem(bookingStorageKey, JSON.stringify(bookings));
    } catch (error) {
      console.error('Error al guardar reserva local:', error);
    }
  }

  function openWhatsApp(phone, bodyText) {
    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(bodyText)}`;
    const popup = window.open(waUrl, '_blank', 'noopener');
    if (!popup) {
      window.location.href = waUrl;
      return;
    }
    try {
      popup.focus();
    } catch (error) {
      // Ignore focus issues in strict browsers.
    }
  }

  return {
    bookingModal: false,
    mobileMenu: false,
    scrolled: false,
    activeTab: 'cafe',
    orderTotal: 0,
    orderCount: 0,
    lightbox: false,
    lightboxImg: '',
    lightboxCaption: '',
    successToast: false,
    timeOfDay: '',
    formName: '',
    formEmail: '',
    formPhone: '',
    formDate: '',
    formTime: '',
    formGuests: '2',
    formSector: 'presencial',
    formComment: '',

    init() {
      window.addEventListener('scroll', () => {
        this.scrolled = window.scrollY > 50;
      });

      const hour = new Date().getHours();
      if (hour >= 8 && hour < 13) {
        this.activeTab = 'cafe';
        this.timeOfDay = 'manana';
      } else if (hour >= 13 && hour < 16) {
        this.activeTab = 'cocina';
        this.timeOfDay = 'almuerzo';
      } else {
        this.activeTab = 'cafe';
        this.timeOfDay = 'tarde';
      }
    },

    getDefaultFormState() {
      return {
        formName: '',
        formEmail: '',
        formPhone: '',
        formDate: '',
        formTime: '',
        formGuests: '2',
        formSector: 'presencial',
        formComment: '',
      };
    },

    resetBookingForm() {
      Object.assign(this, this.getDefaultFormState());
    },

    openLightbox(img, caption) {
      this.lightboxImg = img;
      this.lightboxCaption = caption;
      this.lightbox = true;
    },

    addToOrder(price) {
      this.orderTotal += price;
      this.orderCount += 1;
    },

    resetOrder() {
      this.orderTotal = 0;
      this.orderCount = 0;
    },

    openBooking() {
      this.resetBookingForm();
      this.bookingModal = true;
    },

    closeBooking() {
      this.resetBookingForm();
      this.bookingModal = false;
    },

    submitBooking() {
      if (!this.formName || !this.formPhone || !this.formDate || !this.formTime) {
        alert('Por favor, completa los campos requeridos.');
        return;
      }

      saveBooking({
        source: 'Café',
        clientName: this.formName,
        clientPhone: this.formPhone,
        clientEmail: this.formEmail || '',
        date: this.formDate,
        time: this.formTime,
        type: this.formSector,
        details: `Reserva para ${this.formGuests} personas. Sector: ${this.formSector === 'presencial' ? 'Terraza' : 'Salón Interior'}. Comentarios: ${this.formComment || 'Ninguno'}`,
      });

      const bodyText = `Hola Café La Ruta, me gustaría solicitar una reserva:\n\n` +
        `Nombre: ${this.formName}\n` +
        `Teléfono: ${this.formPhone}\n` +
        `Email: ${this.formEmail || 'No provisto'}\n` +
        `Fecha: ${this.formDate}\n` +
        `Hora: ${this.formTime}\n` +
        `N° de Personas: ${this.formGuests}\n` +
        `Sector Preferido: ${this.formSector === 'presencial' ? 'Terraza (Presencial)' : 'Salón Interior (Online/Privado)'}\n` +
        `Comentarios: ${this.formComment || 'Ninguno'}`;

      openWhatsApp('56999040515', bodyText);

      this.bookingModal = false;
      this.resetBookingForm();
      this.successToast = true;
      setTimeout(() => {
        this.successToast = false;
      }, 3500);
    },
  };
};
