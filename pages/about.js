const m = require('mithril/hyperscript');
const emittable = require('mithril-emittable');
const createFieldBinder = require('../components/field');
const { saveUser } = require('../persistence');

const AboutPage = emittable(function ({ attrs: { user } }, emit) {
  let loading = false;
  const formData = { ...user };
  const bindField = createFieldBinder(emit, () => formData);

  return {
    view: ({ attrs: { user } }) => {
      return m('section.page',
        m('h1', 'About'),
        user && m('form',
          {
            onsubmit: async (event) => {
              event.preventDefault();
              loading = true;
              emit('redraw');
              await saveUser(user, formData);
              loading = false;
              emit('redraw');
            }
          },
          m('field',
            m('label', 'Display Name'),
            m('input', {
              disabled: loading,
              ...bindField('displayName')
            })
          ),
          m('field',
            m('label', 'Birthday'),
            m('input', {
              disabled: loading,
              type: 'date',
              max: Date.now(),
              ...bindField('dateOfBirth', value => new Date(value), value => value && new Date(value).toISOString().slice(0, 10))
            })
          ),
          m('button', { disabled: loading }, 'Save')
        )
      );
    }
  };
});

module.exports = { AboutPage };
