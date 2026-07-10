window.artesaniasApp = function artesaniasApp() {
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
    cartDrawer: false,
    checkoutModal: false,
    successToast: false,
    activeCategory: 'all',
    searchQuery: '',
    shakeCart: false,
    showMiniCart: false,
    geoCommune: '',
    geoLoading: false,
    geoError: '',
    products: [
      { id: 1, name: 'Fuente de Greda Pomaire', price: 18500, category: 'greda', image: 'greda.png', desc: 'Moldeado a mano y cocido en horno de leña. Ideal para preparaciones tradicionales chilenas.', origin: 'Melipilla' },
      { id: 2, name: 'Manta de Lana de Oveja', price: 45000, category: 'lana', image: 'wool.png', desc: 'Tejido rústico hilado a mano en telar de Chiloé. 100% lana natural ultra abrigadora.', origin: 'Chiloé' },
      { id: 3, name: 'Tabla de Madera Nativa (Lenga)', price: 28000, category: 'madera', image: 'wood.png', desc: 'Madera noble de lenga con corte vivo lateral, curada con cera orgánica de abeja.', origin: 'Villarrica' },
      { id: 4, name: 'Paila Rústica de Greda', price: 12500, category: 'greda', image: 'greda.png', desc: 'Paila tradicional con asas de greda refractaria apta para fuego directo.', origin: 'Melipilla' },
      { id: 5, name: 'Choapino Grueso de Telar', price: 22000, category: 'lana', image: 'wool.png', desc: 'Alfombra pequeña de entrada en lana virgen natural gruesa de alta resistencia.', origin: 'Chiloé' },
      { id: 6, name: 'Mortero de Madera de Roble', price: 19500, category: 'madera', image: 'wood.png', desc: 'Tallado a mano en una sola pieza maciza de roble patagónico. Incluye mazo.', origin: 'Villarrica' },
    ],
    cart: [],
    formName: '',
    formPhone: '',
    formAddress: '',
    formSector: 'presencial',
    formComment: '',

    getDefaultFormState() {
      return {
        formName: '',
        formPhone: '',
        formAddress: '',
        formSector: 'presencial',
        formComment: '',
      };
    },

    resetCheckoutForm() {
      Object.assign(this, this.getDefaultFormState());
      this.geoCommune = '';
      this.geoError = '';
    },

    get filteredProducts() {
      return this.products.filter((product) => {
        const matchCategory = this.activeCategory === 'all' || product.category === this.activeCategory;
        const matchSearch = product.name.toLowerCase().includes(this.searchQuery.toLowerCase());
        return matchCategory && matchSearch;
      });
    },

    get cartCount() {
      return this.cart.reduce((sum, item) => sum + item.qty, 0);
    },

    get cartTotal() {
      return this.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    },

    addToCart(product) {
      const item = this.cart.find((cartItem) => cartItem.id === product.id);
      if (item) {
        item.qty += 1;
      } else {
        this.cart.push({ ...product, qty: 1 });
      }

      this.shakeCart = true;
      setTimeout(() => {
        this.shakeCart = false;
      }, 600);

      this.showMiniCart = true;
      setTimeout(() => {
        this.showMiniCart = false;
      }, 3500);
    },

    removeFromCart(id) {
      this.cart = this.cart.filter((item) => item.id !== id);
    },

    updateQty(id, delta) {
      const item = this.cart.find((cartItem) => cartItem.id === id);
      if (!item) {
        return;
      }

      item.qty += delta;
      if (item.qty <= 0) {
        this.removeFromCart(id);
      }
    },

    openCheckout() {
      this.resetCheckoutForm();
      this.checkoutModal = true;
    },

    closeCheckout() {
      this.resetCheckoutForm();
      this.checkoutModal = false;
    },

    detectLocation() {
      this.geoLoading = true;
      this.geoError = '';
      if (!navigator.geolocation) {
        this.geoError = 'Geolocalización no disponible';
        this.geoLoading = false;
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          if (lat < -40) {
            this.geoCommune = 'Puerto Montt / Puerto Varas';
          } else if (lat < -38) {
            this.geoCommune = 'Temuco';
          } else if (lat < -36) {
            this.geoCommune = 'Concepción';
          } else if (lat < -33.5) {
            this.geoCommune = 'Santiago';
          } else if (lat < -29) {
            this.geoCommune = 'La Serena';
          } else {
            this.geoCommune = 'Antofagasta';
          }
          this.geoLoading = false;
        },
        () => {
          this.geoError = 'No se pudo detectar la ubicación';
          this.geoLoading = false;
        }
      );
    },

    submitCheckout() {
      if (!this.formName || !this.formPhone || (this.formSector !== 'presencial' && !this.formAddress)) {
        alert('Por favor, ingresa los datos de entrega requeridos.');
        return;
      }

      const itemsList = this.cart.map((item) => `- ${item.qty}x ${item.name} ($${(item.price * item.qty).toLocaleString('es-CL')})`).join('\n');
      const messageText = `Hola Artesanías del Sur, me gustaría concretar el siguiente pedido:\n\n` +
        `Resumen del Pedido:\n${itemsList}\n\n` +
        `Total: $${this.cartTotal.toLocaleString('es-CL')}\n\n` +
        `Datos de Contacto:\n` +
        `- Nombre: ${this.formName}\n` +
        `- Teléfono: ${this.formPhone}\n` +
        `- Entrega: ${this.formSector === 'presencial' ? 'Retiro en Tienda' : 'Envío a Domicilio'}\n` +
        (this.formSector !== 'presencial' ? `- Dirección: ${this.formAddress}\n` : '') +
        (this.formComment ? `- Notas: ${this.formComment}\n` : '');

      openWhatsApp('56999040515', messageText);

      this.checkoutModal = false;
      this.cartDrawer = false;
      this.resetCheckoutForm();
      this.cart = [];
      this.successToast = true;
      setTimeout(() => {
        this.successToast = false;
      }, 3500);
    },
  };
};
