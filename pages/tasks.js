const m = require('mithril/hyperscript');
const emittable = require('mithril-emittable');
const { Task } = require('../components/task');

const TasksPage = emittable(function ({ attrs: { user } }, emit) {
  return {
    view: ({ attrs: { user } }) => {
      return user && m('section.page',
        m('h1', 'Tasks'),
        user.tasks?.length
          ? [
              m('h2', `You have ${user.tasks.length} task${user.tasks.length > 1 ? 's' : ''}`),
              m('ul',
                user.tasks?.map(task => m(Task, { key: task.id, user, task }))
              )
            ]
          : m('h2', 'You have no tasks'),
        m('button', { type: 'button', onclick: () => emit('navigate', { url: '/tasks/new' }) }, 'Add Task')
      );
    }
  };
});

module.exports = { TasksPage };
