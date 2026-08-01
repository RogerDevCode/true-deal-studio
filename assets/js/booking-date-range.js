window.STAXBookingDateRange = (() => {
  function toLocalIsoDate(date) {
    const local = new Date(date);
    local.setHours(12, 0, 0, 0);
    return local.toISOString().slice(0, 10);
  }

  function create(leadDays = 90) {
    const days = Number.isInteger(leadDays) && leadDays >= 0 ? leadDays : 90;
    const today = new Date();
    const minDate = toLocalIsoDate(today);
    const maximum = new Date(today);
    maximum.setDate(maximum.getDate() + days);
    const maxDate = toLocalIsoDate(maximum);
    return { minDate, maxDate, includes: (value) => Boolean(value) && value >= minDate && value <= maxDate };
  }

  return { create };
})();
