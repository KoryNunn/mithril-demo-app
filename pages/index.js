const m = require('mithril/hyperscript');
const { Router } = require('../components/router');
const emittable = require('mithril-emittable');
const { HomePage } = require('./home');
const { AboutPage } = require('./about');
const { TasksPage } = require('./tasks');
const { TaskEditPage } = require('./taskEdit');

const Pages = emittable(function ({ attrs }, emit) {
  return {
    view: ({ attrs: { user } }) => {
      return m(Router, {
        routes: {
          '/': () => m(HomePage, { user }),
          '/about': () => m(AboutPage, { user }),
          '/tasks': () => user && m(TasksPage, { user }),
          '/tasks/:taskId': (tokens) => user && m(TaskEditPage, { user, key: JSON.stringify([tokens]), ...tokens })
        }
      });
    }
  };
});

module.exports = { Pages };
