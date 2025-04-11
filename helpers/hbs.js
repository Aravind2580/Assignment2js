module.exports = {
    isDueSoon: function (dueDate) {
      if (!dueDate) return false;
      const today = new Date();
      const due = new Date(dueDate);
      const diffDays = (due - today) / (1000 * 60 * 60 * 24);
      return diffDays <= 2 && diffDays >= 0;
    },
    ifEquals: function (a, b, options) {
      return a === b ? options.fn(this) : options.inverse(this);
    }
  };
  