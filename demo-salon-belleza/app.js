window.salonApp = function salonApp() {
  function getTodayLocal() {
    const today = new Date();
    const offset = today.getTimezoneOffset() * 60000;
    return new Date(today.getTime() - offset).toISOString().slice(0, 10);
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
      // The request is already prepared when strict browsers block focus.
    }
  }

  return {
    bookingModal: false,
    selectedServices: [],
    selectedDuration: 0,
    selectedPrice: 0,
    needsGuidance: false,
    successToast: false,
    sliderVal: 50,
    formName: '',
    formPhone: '',
    formDate: '',
    formTime: '',
    formStylist: 'any',
    formComment: '',
    formError: '',
    bookingLeadDays: 90,
    dateRange: window.STAXBookingDateRange.create(90),
    get minDate() { return this.dateRange.minDate; },
    get maxDate() { return this.dateRange.maxDate; },
    lastTrigger: null,

    get checkoutLabel() {
      if (this.needsGuidance || this.selectedServices.length === 0) {
        return 'Revisar solicitud de orientación';
      }
      const amount = this.selectedPrice.toLocaleString('es-CL');
      if (this.selectedServices.length === 1) {
        return `Revisar solicitud · $${amount} estimado`;
      }
      return `Revisar ${this.selectedServices.length} servicios · $${amount} estimado`;
    },

    getDefaultFormState() {
      return {
        formName: '',
        formPhone: '',
        formDate: '',
        formTime: '',
        formStylist: 'any',
        formComment: '',
        formError: '',
      };
    },

    resetBookingForm() {
      Object.assign(this, this.getDefaultFormState());
    },

    resetServiceSelection() {
      this.selectedServices = [];
      this.selectedDuration = 0;
      this.selectedPrice = 0;
      this.needsGuidance = false;
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
      this.needsGuidance = false;
    },

    chooseGuidance(trigger = null) {
      this.resetServiceSelection();
      this.needsGuidance = true;
      this.openBooking(true, trigger);
    },

    openBooking(useGuidance = true, trigger = null) {
      this.resetBookingForm();
      this.needsGuidance = this.selectedServices.length === 0 && useGuidance;
      this.lastTrigger = trigger || document.activeElement;
      this.bookingModal = true;
      this.$nextTick(() => {
        document.getElementById('salon-name')?.focus();
      });
    },

    closeBooking() {
      const trigger = this.lastTrigger;
      this.bookingModal = false;
      this.resetBookingForm();
      this.resetServiceSelection();
      this.$nextTick(() => {
        trigger?.focus?.();
      });
    },

    handleModalKeydown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        this.closeBooking();
        return;
      }
      if (event.key !== 'Tab') {
        return;
      }

      const dialog = event.currentTarget;
      const focusable = Array.from(dialog.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]'
      )).filter((element) => element.offsetParent !== null);
      if (focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },

    submitBooking() {
      this.formError = '';
      if (!this.formName || !this.formPhone || !this.formDate || !this.formTime) {
        this.formError = 'Completa tu nombre, WhatsApp, fecha y hora preferida para preparar la solicitud.';
        return;
      }
      if (this.formDate < this.minDate) {
        this.formError = 'Elige una fecha desde hoy en adelante.';
        document.getElementById('salon-date')?.focus();
        return;
      }
      if (this.formDate > this.maxDate) {
        this.formError = `Elige una fecha dentro de los próximos ${this.bookingLeadDays} días.`;
        document.getElementById('salon-date')?.focus();
        return;
      }
      if (this.selectedServices.length === 0 && !this.needsGuidance) {
        this.formError = 'Selecciona un servicio o elige orientación para preparar la solicitud.';
        return;
      }

      const stylistLabels = {
        any: 'Sin preferencia: recomiéndenme según lo que busco',
        stylist1: 'Valentina Moretti',
        stylist2: 'Ariadna Ruiz',
      };
      const stylistLabel = stylistLabels[this.formStylist] || stylistLabels.any;
      const serviceNames = this.needsGuidance
        ? 'Quiero orientación para elegir'
        : this.selectedServices.map((service) => service.title).join(', ');
      const referenceValue = this.needsGuidance
        ? 'Por conversar'
        : `Desde $${this.selectedPrice.toLocaleString('es-CL')}`;
      const duration = this.needsGuidance
        ? 'Por conversar'
        : `${this.selectedDuration} min estimados`;
      const comment = this.formComment.trim() || 'Por conversar';

      const bodyText = `Hola, Studio Chic. Quiero consultar disponibilidad.\n\n` +
        `Nombre: ${this.formName}\n` +
        `WhatsApp: ${this.formPhone}\n` +
        `Servicio(s): ${serviceNames}\n` +
        `Valor referencial: ${referenceValue}\n` +
        `Duración estimada: ${duration}\n` +
        `Fecha preferida: ${this.formDate}\n` +
        `Hora preferida: ${this.formTime}\n` +
        `Profesional de preferencia: ${stylistLabel}\n` +
        `Modalidad: Presencial\n` +
        `Sobre mi cabello y lo que busco: ${comment}\n\n` +
        `Entiendo que el horario y el valor final se confirman por este medio.`;

      const trigger = this.lastTrigger;
      openWhatsApp('56999040515', bodyText);
      this.bookingModal = false;
      this.resetBookingForm();
      this.resetServiceSelection();
      this.successToast = true;
      this.$nextTick(() => trigger?.focus?.());
      setTimeout(() => {
        this.successToast = false;
      }, 5000);
    },
  };
};
