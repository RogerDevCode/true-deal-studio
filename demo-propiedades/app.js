window.corredoraApp = function corredoraApp() {
  const bookingStorageKey = 'tuwebpro_bookings';
  const ufToClpFactor = 37500;

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
    filterOperacion: 'todos',
    filterTipo: 'todos',
    filterComuna: 'todas',
    filterPrecioMax: 30000,
    isBookingOpen: false,
    selectedProperty: null,
    properties: [
      {
        id: 1,
        titulo: 'Departamento Dúplex en Providencia',
        operacion: 'arriendo',
        tipo: 'departamento',
        precioUF: 32,
        precioCLP: 32 * ufToClpFactor,
        comuna: 'Providencia',
        dormitorios: 2,
        banos: 2,
        superficieM2: 85,
        imagen: 'depto1.png',
        descripcion: 'Hermoso dúplex con terraza privada, cocina americana equipada y excelente conectividad.',
      },
      {
        id: 2,
        titulo: 'Casa Colonial Moderna en Las Condes',
        operacion: 'venta',
        tipo: 'casa',
        precioUF: 14800,
        precioCLP: 14800 * ufToClpFactor,
        comuna: 'Las Condes',
        dormitorios: 4,
        banos: 3,
        superficieM2: 220,
        imagen: 'casa1.png',
        descripcion: 'Amplia casa colonial remodelada, con gran patio, piscina, terraza techada y quincho.',
      },
      {
        id: 3,
        titulo: 'Penthouse Vista Panorámica en Vitacura',
        operacion: 'venta',
        tipo: 'departamento',
        precioUF: 22500,
        precioCLP: 22500 * ufToClpFactor,
        comuna: 'Vitacura',
        dormitorios: 3,
        banos: 4,
        superficieM2: 180,
        imagen: 'depto2.png',
        descripcion: 'Exclusivo penthouse con azotea privada de 120m², quincho, jacuzzi y vistas libres al cerro Manquehue.',
      },
      {
        id: 4,
        titulo: 'Loft Industrial Doble Altura en Providencia',
        operacion: 'arriendo',
        tipo: 'departamento',
        precioUF: 25,
        precioCLP: 25 * ufToClpFactor,
        comuna: 'Providencia',
        dormitorios: 1,
        banos: 2,
        superficieM2: 70,
        imagen: 'depto3.png',
        descripcion: 'Estilo industrial neoyorquino con muros de ladrillo a la vista, piso de hormigón pulido y ventanas termo-panel.',
      },
      {
        id: 5,
        titulo: 'Departamento frente al Mar en Concón',
        operacion: 'arriendo',
        tipo: 'departamento',
        precioUF: 30,
        precioCLP: 30 * ufToClpFactor,
        comuna: 'Concón',
        dormitorios: 2,
        banos: 2,
        superficieM2: 95,
        imagen: 'depto4.png',
        descripcion: 'Espectacular vista en primera línea frente a playa Amarilla. Condominio cuenta con piscina exterior y gimnasio.',
      },
    ],

    get filteredProperties() {
      return this.properties.filter((property) => {
        const matchOperacion = this.filterOperacion === 'todos' || property.operacion === this.filterOperacion;
        const matchTipo = this.filterTipo === 'todos' || property.tipo === this.filterTipo;
        const matchComuna = this.filterComuna === 'todas' || property.comuna === this.filterComuna;
        const matchPrecio = property.precioUF <= this.filterPrecioMax;
        return matchOperacion && matchTipo && matchComuna && matchPrecio;
      });
    },

    formatUF(value) {
      return new Intl.NumberFormat('es-CL', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
      }).format(value) + ' UF';
    },

    formatCLP(value) {
      return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0,
      }).format(value);
    },

    openBooking(property) {
      this.selectedProperty = property;
      this.isBookingOpen = true;
    },

    closeBooking() {
      this.isBookingOpen = false;
      this.selectedProperty = null;
    },

    sendBookingToWhatsApp(name, phone, type, date, timeSlot) {
      if (!name.trim() || !phone.trim() || !date) {
        alert('Por favor complete todos los campos obligatorios (*).');
        return;
      }

      const propertyTitle = this.selectedProperty ? this.selectedProperty.titulo : 'una propiedad';
      const propertyPrice = this.selectedProperty ? this.formatUF(this.selectedProperty.precioUF) : '';
      const propertyComuna = this.selectedProperty ? this.selectedProperty.comuna : '';

      saveBooking({
        source: 'Propiedades',
        clientName: name,
        clientPhone: phone,
        clientEmail: '',
        date,
        time: timeSlot === 'mañana' ? '09:00 - 13:00' : '14:00 - 18:00',
        type,
        details: `Propiedad: "${propertyTitle}" (${propertyPrice}) en ${propertyComuna}`,
      });

      const message = `¡Hola Cobre & Co. Propiedades! Me interesa coordinar una visita para la propiedad "${propertyTitle}" (${propertyPrice}) en la comuna de ${propertyComuna}.\n\n` +
        `- Modalidad: ${type === 'presencial' ? 'Presencial (En el inmueble)' : 'Virtual (Videollamada)'}\n` +
        `- Fecha propuesta: ${date}\n` +
        `- Bloque de horario: ${timeSlot}\n\n` +
        `Mis datos de contacto:\n` +
        `- Nombre: ${name}\n` +
        `- WhatsApp: ${phone}`;

      openWhatsApp('56999040515', message);
      this.closeBooking();
    },
  };
};
