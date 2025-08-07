const m = require('mithril/hyperscript');
const emittable = require('mithril-emittable');
const { handleForm } = require('../components/field');
const { loadTask, saveTask } = require('../persistence');

const TaskEditPage = emittable(function ({ attrs: { user, taskId } }, emit) {
  const formHandler = handleForm(emit);
  let taskLoading = false;
  let taskData = { name: '' };

  async function load () {
    taskLoading = true;
    emit('redraw');
    const task = await loadTask(user, taskId);
    taskData = { ...task };
    taskLoading = false;
    emit('redraw');
  }

  if (taskId !== 'new') {
    load();
  }

  return {
    view: ({ attrs: { user } }) => {
      const { bindInput, bindForm, loading: formLoading, getFieldErrors } = formHandler(taskData);
      const loading = formLoading || taskLoading;

      return m('section.page',
        m('h1', 'Task'),
        m('h2', taskData.name),
        m('form',
          bindForm({
            onsubmit: async (event) => {
              await saveTask(user, taskData);
              emit('navigate', { url: '/tasks', type: 'back' });
            }
          }),
          m('fieldset',
            m('field',
              m('label', 'Name'),
              m('input', {
                disabled: loading,
                ...bindInput('name')
              }),
              getFieldErrors('name')?.map(fieldError =>
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

module.exports = { TaskEditPage };
