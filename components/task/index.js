const m = require('mithril/hyperscript');
const emittable = require('mithril-emittable');
const { removeTask, saveTask } = require('../../persistence');

const Task = emittable(function ({ attrs: { user } }, emit) {
  let loading = false;

  async function remove (task) {
    loading = true;
    emit('redraw');
    await removeTask(user, task.id);
    emit('redraw');
  }

  async function toggleDone (task) {
    loading = true;
    emit('redraw');
    await saveTask(user, { ...task, done: !task.done });
    loading = false;
    emit('redraw');
  }

  return {
    view: ({ attrs: { task } }) => m('li.task', { inert: loading, class: task.done ? 'done' : undefined, key: task.id },
      m('b', {
        title: task.done ? 'done' : undefined
      }, task.name),
      m('nav',
        m('a', { href: `/tasks/${task.id}` }, 'edit'),
        m('button', { type: 'button', disabled: loading, onclick: () => remove(task) }, 'X'),
        m('button', {
          type: 'button',
          disabled: loading,
          onclick: () => toggleDone(task)
        }, task.done ? 'Mark as not done' : 'Mark as done')
      )
    )
  };
});

module.exports = { Task };
