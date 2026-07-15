window.psicologaApp = function psicologaApp() {
  const bookingStorageKey = 'tuwebpro_bookings';
  const profileStorageKeys = {
    name: 'psicologa_name',
    phone: 'psicologa_phone',
    email: 'psicologa_email',
    modalidad: 'psicologa_modalidad',
  };

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
    name: '',
    phone: '',
    email: '',
    modalidad: 'presencial',
    motivo: '',
    selectedSlot: '',
    isReturningUser: false,
    showAllFields: false,
    urlBadge: '',
    timeSlots: [],

    init() {
      const savedName = localStorage.getItem(profileStorageKeys.name);
      const savedPhone = localStorage.getItem(profileStorageKeys.phone);
      const savedEmail = localStorage.getItem(profileStorageKeys.email);
      const savedModalidad = localStorage.getItem(profileStorageKeys.modalidad);

      if (savedName) {
        this.name = savedName;
      }
      if (savedPhone) {
        this.phone = savedPhone;
      }
      if (savedEmail) {
        this.email = savedEmail;
      }
      if (savedModalidad) {
        this.modalidad = savedModalidad;
      }
      if (savedName && savedPhone && savedEmail) {
        this.isReturningUser = true;
      }

      const params = new URLSearchParams(window.location.search);
      const tipo = params.get('tipo');
      const tipoMap = {
        parejas: { motivo: 'Terapia de pareja', badge: '📍 Terapia de Pareja' },
        ansiedad: { motivo: 'Manejo de ansiedad', badge: '📍 Manejo de Ansiedad' },
        duelo: { motivo: 'Proceso de duelo', badge: '📍 Proceso de Duelo' },
      };
      if (tipo && tipoMap[tipo]) {
        this.motivo = tipoMap[tipo].motivo;
        this.urlBadge = tipoMap[tipo].badge;
      }

      const now = new Date();
      const hour = now.getHours();
      const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
      const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      const formatDate = (date) => `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;

      const day0 = new Date(now);
      day0.setHours(0, 0, 0, 0);
      const day1 = new Date(day0);
      day1.setDate(day1.getDate() + 1);
      const day2 = new Date(day0);
      day2.setDate(day2.getDate() + 2);
      const day3 = new Date(day0);
      day3.setDate(day3.getDate() + 3);

      const firstSlot = hour < 14 ? `${formatDate(day0)} · 16:00` : `${formatDate(day1)} · 10:00`;
      this.timeSlots = [firstSlot, `${formatDate(day2)} · 11:00`, `${formatDate(day3)} · 15:00`];
    },

    getDefaultFormState() {
      return {
        name: '',
        phone: '',
        email: '',
        modalidad: 'presencial',
        motivo: '',
        selectedSlot: '',
        showAllFields: false,
      };
    },

    resetForm() {
      Object.assign(this, this.getDefaultFormState());
      if (this.$refs && this.$refs.form) {
        this.$refs.form.reset();
      }
    },

    submitForm() {
      localStorage.setItem(profileStorageKeys.name, this.name);
      localStorage.setItem(profileStorageKeys.phone, this.phone);
      localStorage.setItem(profileStorageKeys.email, this.email);
      localStorage.setItem(profileStorageKeys.modalidad, this.modalidad);

      const [datePart = '', timePart = ''] = this.selectedSlot ? this.selectedSlot.split(' · ') : [];
      saveBooking({
        source: 'Psicóloga',
        clientName: this.name,
        clientPhone: this.phone,
        clientEmail: this.email,
        date: datePart || new Date().toLocaleDateString('es-CL'),
        time: timePart || 'Por definir',
        type: this.modalidad,
        details: `Motivo: ${this.motivo || 'Sesión Clínica'}`,
      });

      const slotLine = this.selectedSlot ? `\nHora solicitada: ${this.selectedSlot}` : '';
      const bodyText = `Hola Psicóloga Clara, quisiera solicitar una sesión.\n\n` +
        `Nombre: ${this.name}\n` +
        `Teléfono: ${this.phone}\n` +
        `Email: ${this.email}\n` +
        `Modalidad: ${this.modalidad === 'presencial' ? 'Presencial' : 'Online'}${slotLine}\n` +
        `Motivo: ${this.motivo || 'Sesión Clínica'}`;

      openWhatsApp('56999040515', bodyText);
      this.bookingModal = false;
    },

    whatsappHref() {
      const greeting = this.selectedSlot
        ? `Hola Psicóloga Clara, quisiera consultar por la hora del ${this.selectedSlot}.`
        : 'Hola Psicóloga Clara, quisiera consultar por horas disponibles de sesión.';
      return 'https://wa.me/56999040515?text=' + encodeURIComponent(greeting);
    },
  };
};
