const m = require('mithril/hyperscript');
const emittable = require('mithril-emittable');
const { Pages } = require('../../pages');
const { loadLoggedInUser, login } = require('../../persistence');

const App = emittable(function (_, emit) {
  let user = null;

  async function load () {
    user = await loadLoggedInUser();
    emit('redraw');
  }

  async function showLogin () {
    const displayName = window.prompt('Whats ya name');
    user = await login(displayName);
    emit('redraw');
  }

  load();

  return {
    view: () => m('div.app',
      m('div.content',
        m('div',
          m('h1', { href: '/' }, 'Mithril demo app'),
          user == null ? m('button', { onclick: showLogin }, 'Login') : user.displayName,
          m('div.appMenu',
            [
              m('a', { href: '/' }, 'Home'),
              m('a', { href: '/about' }, 'About'),
              m('a', { href: '/tasks' }, 'Tasks')
            ]
          )
        ),
        [m(Pages, { key: user, user })]
      )
    )
  };
});

module.exports = { App };
