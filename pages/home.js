const m = require('mithril/hyperscript');
const emittable = require('mithril-emittable');
const { Countdown } = require('../components/countdown');

function getNextBirthday (dob) {
  const dateOfBirth = new Date(dob);
  const today = new Date();
  const year = today.getFullYear();

  const next = new Date(year, dateOfBirth.getMonth(), dateOfBirth.getDate());

  if (next < today) {
    next.setFullYear(year + 1);
  }

  return next;
}

const HomePage = emittable(function ({ attrs }, emit) {
  return {
    view: ({ attrs: { user } }) => {
      return m('section.page',
        m('h1', 'Home'),
        user && m('p', `Hello ${user.displayName}`),
        user?.dateOfBirth
          ? [
              m('p', 'Omg only ', m(Countdown, { date: getNextBirthday(user.dateOfBirth) }), ' until your birthday!')
            ]
          : m('a', { href: '/about' }, 'Tell me about yourself')
      );
    }
  };
});

module.exports = { HomePage };
