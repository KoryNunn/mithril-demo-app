const m = require('mithril/hyperscript');
const emittable = require('mithril-emittable');
const { handleForm } = require('../components/field');
const { saveUser } = require('../persistence');

const AboutPage = emittable(function ({ attrs: { user } }, emit) {
  const formHandler = handleForm(emit);
  const formData = { ...user };

  return {
    view: ({ attrs: { user } }) => {
      const { bindInput, bindForm, loading, getFieldErrors } = formHandler(formData);

      return m('section.page',
        m('h1', 'About'),
        user && m('form',
          bindForm({
            onsubmit: async (event) => {
              await saveUser(user, formData);
            }
          }),
          m('fieldset',
            m('field',
              m('label', 'Display Name'),
              m('input', {
                disabled: loading,
                ...bindInput('displayName')
              }),
              getFieldErrors('displayName')?.map(fieldError =>
                m('div.error', fieldError)
              )
            ),
            m('field',
              m('label', 'Birthday'),
              m('input', {
                disabled: loading,
                type: 'date',
                max: Date.now(),
                ...bindInput('dateOfBirth', value => new Date(value), value => value && new Date(value).toISOString().slice(0, 10))
              }),
              getFieldErrors('dateOfBirth')?.map(fieldError =>
                m('div.error', fieldError)
              )
            )
          ),
          m('button', { disabled: loading }, 'Save')
        )
      );
    }
  };
});

module.exports = { AboutPage };
