window.openWhatsAppWithFallback = function openWhatsAppWithFallback(url) {
  const popup = window.open(url, '_blank', 'noopener');

  if (popup) {
    try {
      popup.focus();
    } catch (error) {
      // Ignore focus issues from strict browsers.
    }
    return true;
  }

  window.location.href = url;
  return false;
};

window.landingApp = function landingApp() {
  return {
    mobileMenu: false,
    showVideo: false,
    planTimes: { esencial: 0, local: 0, profesional: 0, premium: 0 },
    activePlan: null,
    hoverStart: null,
    darkMode: localStorage.getItem('theme') === 'dark',

    toggleTheme() {
      this.darkMode = !this.darkMode;
      localStorage.setItem('theme', this.darkMode ? 'dark' : 'light');
    },

    startPlanHover(plan) {
      this.activePlan = plan;
      this.hoverStart = Date.now();
    },

    endPlanHover(plan) {
      if (this.activePlan === plan && this.hoverStart) {
        this.planTimes[plan] += Date.now() - this.hoverStart;
        this.activePlan = null;
        this.hoverStart = null;
      }
    },

    getMostViewedPlan() {
      let maxTime = 0;
      let mostViewed = 'Profesional';

      for (const [plan, time] of Object.entries(this.planTimes)) {
        if (time > maxTime) {
          maxTime = time;
          mostViewed = plan.charAt(0).toUpperCase() + plan.slice(1);
        }
      }

      return mostViewed;
    },
  };
};
