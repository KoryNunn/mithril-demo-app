const m = require('mithril/hyperscript');
const { Router } = require('../components/router');
const emittable = require('mithril-emittable');
const { HomePage } = require('./home');
const { AboutPage } = require('./about');

const Pages = emittable(function({ attrs }, emit) {
  return {
    view: ({ attrs: { user } }) => {
      return m(Router, {
        routes: {
          '/': () => m(HomePage, { user }),
          '/about': () => m(AboutPage, { user })
        }
      })
    }
  }
});

module.exports = { Pages };
