window.salonApp = function salonApp() {
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
    selectedServices: [],
    selectedDuration: 0,
    selectedPrice: 0,
    successToast: false,
    sliderVal: 50,
    formName: '',
    formEmail: '',
    formPhone: '',
    formDate: '',
    formTime: '',
    formSector: 'presencial',
    formStylist: 'any',
    formComment: '',
    autoStylist: '',
    autoStylistSpecialty: '',
    activeServiceContext: '',

    getDefaultFormState() {
      return {
        formName: '',
        formEmail: '',
        formPhone: '',
        formDate: '',
        formTime: '',
        formSector: 'presencial',
        formStylist: 'any',
        formComment: '',
      };
    },

    resetBookingForm() {
      Object.assign(this, this.getDefaultFormState());
    },

    resetServiceSelection() {
      this.selectedServices = [];
      this.selectedDuration = 0;
      this.selectedPrice = 0;
      this.autoStylist = '';
      this.autoStylistSpecialty = '';
      this.activeServiceContext = '';
    },

    toggleService(id, title, price, duration) {
      const index = this.selectedServices.findIndex((service) => service.id === id);
      if (index > -1) {
        this.selectedServices.splice(index, 1);
        this.selectedPrice -= price;
        this.selectedDuration -= duration;
      } else {
        this.selectedServices.push({ id, title, price, duration });
        this.selectedPrice += price;
        this.selectedDuration += duration;
      }

      const hasBalayage = this.selectedServices.some((service) => service.title.toLowerCase().includes('balayage') || service.title.toLowerCase().includes('iluminac'));
      const hasCorte = this.selectedServices.some((service) => service.title.toLowerCase().includes('corte') || service.title.toLowerCase().includes('peinado'));

      if (hasBalayage) {
        this.autoStylist = 'Valentina Moretti';
        this.autoStylistSpecialty = 'Especialista en Balayage e Iluminación';
        this.formStylist = 'stylist1';
      } else if (hasCorte) {
        this.autoStylist = 'Ariadna Ruiz';
        this.autoStylistSpecialty = 'Especialista en Cortes y Peinados';
        this.formStylist = 'stylist2';
      } else {
        this.autoStylist = '';
        this.autoStylistSpecialty = '';
        this.formStylist = 'any';
      }

      const hasColor = this.selectedServices.some((service) =>
        service.title.toLowerCase().includes('color') ||
        service.title.toLowerCase().includes('balayage') ||
        service.title.toLowerCase().includes('iluminac') ||
        service.title.toLowerCase().includes('keratina') ||
        service.title.toLowerCase().includes('reconstruc')
      );
      const hasCorteCtx = this.selectedServices.some((service) => service.title.toLowerCase().includes('corte') || service.title.toLowerCase().includes('peinado'));

      if (hasColor) {
        this.activeServiceContext = 'color';
      } else if (hasCorteCtx) {
        this.activeServiceContext = 'corte';
      } else {
        this.activeServiceContext = '';
      }
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
        alert('Por favor, ingresa los datos requeridos (Nombre, Teléfono, Fecha y Hora).');
        return;
      }

      const servicesNames = this.selectedServices.map((service) => service.title).join(', ');
      const servicesList = this.selectedServices.map((service) => `- ${service.title} ($${service.price.toLocaleString('es-CL')})`).join('\n');
      const stylistLabel = this.formStylist === 'stylist1' ? 'Valentina Moretti' : 'Cualquier profesional disponible';

      saveBooking({
        source: 'Peluquería',
        clientName: this.formName,
        clientPhone: this.formPhone,
        clientEmail: this.formEmail || '',
        date: this.formDate,
        time: this.formTime,
        type: this.formSector,
        details: `Estilista: ${stylistLabel}. Servicios: ${servicesNames || 'Ninguno'} (Total: $${this.selectedPrice.toLocaleString('es-CL')} CLP)`,
      });

      const bodyText = `Hola Studio Chic, solicito agendar una hora de atención:\n\n` +
        `Nombre: ${this.formName}\n` +
        `Teléfono: ${this.formPhone}\n` +
        `Email: ${this.formEmail || 'No provisto'}\n\n` +
        `Servicios Solicitados:\n${servicesList || 'Ninguno seleccionado'}\n` +
        `Total Estimado: $${this.selectedPrice.toLocaleString('es-CL')} (${this.selectedDuration} min)\n\n` +
        `Fecha: ${this.formDate}\n` +
        `Hora: ${this.formTime}\n` +
        `Estilista de Preferencia: ${stylistLabel}\n` +
        `Sector de Atención: ${this.formSector === 'presencial' ? 'Presencial (Tocador Central)' : 'Online / Diagnóstico a Distancia'}\n` +
        `Detalles Adicionales: ${this.formComment || 'Ninguno'}`;

      openWhatsApp('56999040515', bodyText);

      this.bookingModal = false;
      this.resetBookingForm();
      this.resetServiceSelection();
      this.successToast = true;
      setTimeout(() => {
        this.successToast = false;
      }, 3500);
    },

    handleDrag(event) {
      const rect = this.$refs.sliderContainer.getBoundingClientRect();
      const clientX = event.touches ? event.touches[0].clientX : event.clientX;
      const offset = clientX - rect.left;
      let percentage = (offset / rect.width) * 100;

      if (percentage < 0) {
        percentage = 0;
      }
      if (percentage > 100) {
        percentage = 100;
      }

      this.sliderVal = percentage.toFixed(2);
    },
  };
};
