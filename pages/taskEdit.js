const m = require('mithril/hyperscript');
const emittable = require('mithril-emittable');
const createFieldBinder = require('../components/field');
const { loadTask, saveTask } = require('../persistence');

const TaskEditPage = emittable(function ({ attrs: { user, taskId } }, emit) {
  let loading = false;
  let taskData = {};
  const bindField = createFieldBinder(emit, () => taskData);

  async function load () {
    loading = true;
    emit('redraw');
    const task = await loadTask(user, taskId);
    taskData = { ...task };
    loading = false;
    emit('redraw');
  }

  if (taskId !== 'new') {
    load();
  }

  return {
    view: ({ attrs: { user } }) => {
      return m('section.page',
        m('h1', 'Task'),
        m('h2', taskData.name),
        m('form',
          {
            onsubmit: async (event) => {
              event.preventDefault();
              loading = true;
              emit('redraw');
              await saveTask(user, taskData);
              emit('navigate', { url: '/tasks', type: 'back' });
            }
          },
          m('field',
            m('label', 'Name'),
            m('input', {
              disabled: loading,
              ...bindField('name')
            })
          ),
          m('button', { disabled: loading }, 'Save')
        )
      );
    }
  };
});

module.exports = { TaskEditPage };
