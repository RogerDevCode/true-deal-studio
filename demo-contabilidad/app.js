window.contabilidadApp = function contabilidadApp() {
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
    successToast: false,
    highlightedPlan: 'Plan Emprendedor',
    facturasMes: 10,
    trabajadores: 2,
    calcPlanName: 'Plan Emprendedor',
    calcPlanPrice: 45000,
    formRut: '',
    rutValidating: false,
    rutData: null,
    formName: '',
    formEmail: '',
    formPhone: '',
    formDate: '',
    formTime: '',
    formSector: 'presencial',
    formComment: '',

    init() {
      this.$watch('facturasMes', () => this.recalculate());
      this.$watch('trabajadores', () => this.recalculate());
      this.recalculate();
    },

    getDefaultFormState() {
      return {
        formRut: '',
        rutValidating: false,
        rutData: null,
        formName: '',
        formEmail: '',
        formPhone: '',
        formDate: '',
        formTime: '',
        formSector: 'presencial',
        formComment: '',
      };
    },

    resetBookingForm() {
      Object.assign(this, this.getDefaultFormState());
    },

    recalculate() {
      const facturas = parseInt(this.facturasMes, 10);
      const empleados = parseInt(this.trabajadores, 10);

      if (facturas <= 20 && empleados <= 2) {
        this.calcPlanName = 'Plan Emprendedor';
        this.calcPlanPrice = 45000;
      } else if (facturas <= 80 && empleados <= 8) {
        this.calcPlanName = 'Plan Pyme Crecimiento';
        this.calcPlanPrice = 95000;
      } else {
        this.calcPlanName = 'Plan Premium Corporativo';
        this.calcPlanPrice = 185000;
      }

      this.highlightedPlan = this.calcPlanName;
    },

    validateRut(rut) {
      if (!rut || rut.length < 7) {
        return;
      }

      this.rutValidating = true;
      setTimeout(() => {
        const mockDB = {
          '76.123.456-7': { razonSocial: 'Comercial Los Andes SpA', giro: 'Comercio al por mayor' },
          '12.345.678-9': { razonSocial: 'Transportes del Sur Ltda.', giro: 'Transporte y logística' },
          '98.765.432-1': { razonSocial: 'Soluciones Digitales S.A.', giro: 'Desarrollo de software' },
          '11.111.111-1': { razonSocial: 'Panadería El Trigo Ltda.', giro: 'Elaboración de productos de panadería' },
        };
        const cleanedRut = rut.replace(/\s/g, '');

        this.rutData = mockDB[cleanedRut] || null;
        if (!this.rutData && cleanedRut.length >= 9) {
          this.rutData = { razonSocial: 'Empresa registrada en SII SpA', giro: 'Servicios Profesionales' };
        }

        if (this.rutData && !this.formName) {
          this.formName = this.rutData.razonSocial;
        }

        this.rutValidating = false;
      }, 800);
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
        alert('Por favor, completa los campos requeridos para agendar.');
        return;
      }

      const rutDetails = this.rutData ? ` (${this.rutData.razonSocial})` : '';

      saveBooking({
        source: 'Contabilidad',
        clientName: this.formName,
        clientPhone: this.formPhone,
        clientEmail: this.formEmail || '',
        date: this.formDate,
        time: this.formTime,
        type: this.formSector,
        details: `Empresa RUT: ${this.formRut || 'No provisto'}${rutDetails}. Plan Cotizado: ${this.calcPlanName} ($${this.calcPlanPrice.toLocaleString('es-CL')} CLP/mes)`,
      });

      const bodyText = `Hola ContaDigital, solicito agendar una reunión de asesoría tributaria:\n\n` +
        `RUT Empresa: ${this.formRut || 'No provisto'}\n` +
        (this.rutData ? `Razón Social: ${this.rutData.razonSocial}\nGiro: ${this.rutData.giro}\n` : '') +
        `Nombre Representante: ${this.formName}\n` +
        `Teléfono: ${this.formPhone}\n` +
        `Email: ${this.formEmail || 'No provisto'}\n\n` +
        `Plan Cotizado en Calculadora:\n` +
        `- Plan: ${this.calcPlanName}\n` +
        `- Tarifa Mensual: Desde $${this.calcPlanPrice.toLocaleString('es-CL')} CLP neto + IVA / mes\n` +
        `- Parámetros: ${this.facturasMes} facturas/mes y ${this.trabajadores} trabajadores\n\n` +
        `Fecha Propuesta: ${this.formDate}\n` +
        `Hora Propuesta: ${this.formTime}\n` +
        `Tipo de Reunión: ${this.formSector === 'presencial' ? 'Presencial (Oficina Providencia)' : 'Online (Videollamada Meet)'}\n` +
        `Mensaje/Dudas: ${this.formComment || 'Ninguno'}`;

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
