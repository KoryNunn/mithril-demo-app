const emittable = require('mithril-emittable');

function timeUntil (date) {
  let diff = new Date(date) - new Date();

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff %= 1000 * 60 * 60 * 24;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff %= 1000 * 60 * 60;

  const minutes = Math.floor(diff / (1000 * 60));
  diff %= 1000 * 60;

  const seconds = Math.floor(diff / 1000);

  return { days, hours, minutes, seconds };
}

const Countdown = emittable(function (_, emit) {
  const interval = setInterval(() => {
    emit('redraw');
  }, 100);

  return {
    onremove: () => clearInterval(interval),
    view: ({ attrs: { date } }) => {
      const { days, hours, minutes, seconds } = timeUntil(date);

      return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
    }
  };
});

module.exports = { Countdown };
