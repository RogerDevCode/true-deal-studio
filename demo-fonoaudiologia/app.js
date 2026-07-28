window.fonoaudiologiaApp = function fonoaudiologiaApp() {
  const bookingStorageKey = 'tuwebpro_bookings';
  const defaultLiveFaqWidgetUrl = 'http://localhost:5173/widget/fonoaudiologia';
  const serviceNames = {
    evaluacion: 'Primera visita de orientación',
    inicio_tardio: 'Inicio Tardío del Habla',
    sonidos: 'Sonidos del Habla (TSH)',
    comunicacion: 'Comunicación Social y Juego',
    asesoria: 'Asesoría de Crianza para Apoderados',
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
      console.error('Error al registrar reserva en el CRM local:', error);
    }
  }

  function openWhatsApp(phone, message) {
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    const popup = window.open(url, '_blank', 'noopener');
    if (!popup) {
      window.location.href = url;
      return;
    }
    try {
      popup.focus();
    } catch (error) {
      // Ignore focus issues from strict browsers.
    }
  }

  return {
    bookingModal: false,
    selectedService: 'evaluacion',
    liveFaqOpen: false,
    liveFaqWidgetError: false,
    liveFaqWidgetUrl: window.FONO_LIVE_FAQ_WIDGET_URL || defaultLiveFaqWidgetUrl,

    openLiveFaq() {
      this.liveFaqWidgetError = false;
      this.liveFaqOpen = true;
    },

    closeLiveFaq() {
      this.liveFaqOpen = false;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.querySelector('[data-testid="fono-live-faq-orb"]')?.focus();
        });
      });
    },

    submitBooking(name, phone, date, slot, details) {
      if (!name || !phone || !date) {
        alert('Por favor completa todos los campos requeridos (*).');
        return;
      }

      const selectedServiceName = serviceNames[this.selectedService] || 'Fonoaudiología';
      const detailSummary = details.trim() || 'Por conversar durante la coordinación';

      saveBooking({
        source: 'Fonoaudiología',
        clientName: name,
        clientPhone: phone,
        clientEmail: '',
        date,
        time: slot === 'mañana' ? '09:00 - 13:00' : '14:00 - 18:00',
        type: 'presencial',
        details: `Servicio: "${selectedServiceName}". Antecedentes: ${detailSummary}. Atención a domicilio en Santiago.`,
      });

      const message = `Hola, Nahovy. Quiero solicitar una primera visita a domicilio para mi hijo/a:\n\n` +
        `- Servicio consultado: ${selectedServiceName}\n` +
        `- Fecha preferida: ${date}\n` +
        `- Horario preferido: ${slot === 'mañana' ? 'Mañana (09:00 - 13:00)' : 'Tarde (14:00 - 18:00)'}\n` +
        `- Antecedentes compartidos: ${detailSummary}\n\n` +
        `Mis datos de contacto:\n` +
        `- Nombre: ${name}\n` +
        `- WhatsApp: ${phone}`;

      openWhatsApp('56964910042', message);
      this.bookingModal = false;
    },
  };
};
