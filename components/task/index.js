const m = require('mithril/hyperscript');
const emittable = require('mithril-emittable');
const { removeTask } = require('../../persistence');

const Task = emittable(function ({ attrs: { user, task } }, emit) {
  let loading = false;

  async function remove (task) {
    loading = true;
    emit('redraw');
    await removeTask(user, task.id);
    emit('redraw');
  }

  return {
    view: () => m('li.task', { key: task.id },
      m('b', task.name),
      m('nav',
        m('a', { href: `/tasks/${task.id}` }, 'edit'),
        m('button', { type: 'button', disabled: loading, onclick: () => remove(task) }, 'X')
      )
    )
  };
});

module.exports = { Task };
