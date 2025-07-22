const m = require('mithril/hyperscript');
const emittable = require('mithril-emittable');
const { Pages } = require('../../pages');

const App = emittable(function(_, emit) {
  let user = null;

  function showLogin() {
    const displayName = prompt('Whats ya name');
    user = { displayName };
    emit('redraw');
  }

  return {
    view: ({ attrs: { } }) => m('div.app',
      m('div.content',
        m('div',
          m('h1', { href: '/' }, 'Mithril demo app'),
          user == null ? m('button', { onclick: showLogin }, 'Login') : user.displayName,
          m('div.appMenu',
            [
              m('a', { href: '/' }, 'Home'),
              m('a', { href: '/about' }, 'About')
            ],
          )
        ),
        [m(Pages, { key: user, user })]
      )
    )
  }
});

module.exports = { App };
