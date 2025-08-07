const { validate, User, Task } = require('./validators');
/**
 * @returns {Promise<void>}
 */
async function simulateServerWait () {
  const simulatedServerWait = window.SIMULATED_SERVER_WAIT || 300;
  await new Promise(resolve => setTimeout(resolve, simulatedServerWait));
}

const userWatchers = new Set();

function triggerUserChange (user) {
  for (const handler of userWatchers) {
    handler(user);
  }
}

/**
 * @returns {Promise<User | null>}
 */
function watchUser (handler) {
  userWatchers.add(handler);

  function unwatch () {
    userWatchers.delete(handler);
  }

  (async function () {
    await simulateServerWait();

    const loggedInUserData = window.localStorage.getItem('mithril-demo-user');

    if (!loggedInUserData) {
      return null;
    }

    let user = JSON.parse(loggedInUserData);
    user = validate(User, user);

    triggerUserChange(user);
  })();

  return unwatch;
}

/**
 * @param {string} displayName
 * @returns {Promise<User>}
 */
async function login (displayName) {
  await simulateServerWait();
  const loggedInUserData = window.localStorage.getItem('mithril-demo-user');
  let user = (loggedInUserData && JSON.parse(loggedInUserData)) || { displayName, tasks: [] };
  user = validate(User, user);
  window.localStorage.setItem('mithril-demo-user', JSON.stringify(user));
  triggerUserChange(user);
  return user;
}

/**
 * @param {User} user
 * @param {Partial<User>} [updatedUserData]
 * @returns {Promise<void>}
 */
async function saveUser (user, updatedUserData) {
  await simulateServerWait();
  let newUser = user;
  if (updatedUserData) {
    newUser = { ...user, ...updatedUserData };
  }
  newUser = validate(User, newUser);
  window.localStorage.setItem('mithril-demo-user', JSON.stringify(newUser));
  triggerUserChange(newUser);
}

/**
 * @param {User} user
 * @param {string} taskId
 * @returns {Promise<Task | undefined>}
 */
async function loadTask (user, taskId) {
  await simulateServerWait();
  const task = user.tasks?.find(task => task.id === taskId);

  if (!task) {
    return null;
  }

  return validate(Task, task);
}

/**
 * @param {User} user
 * @param {Task} taskData
 * @returns {Promise<void>}
 */
async function saveTask (user, taskData) {
  const task = await loadTask(user, taskData.id);
  if (!task) {
    const id = String(Math.round(Math.random() * 1e10));
    const validatedTask = validate(Task, { ...taskData, id });
    user.tasks = user.tasks || [];
    user.tasks.push(validatedTask);
  } else {
    const validatedTask = validate(Task, { ...task, ...taskData });
    user.tasks.splice(user.tasks.findIndex(existingTask => existingTask.id === task.id), 1, validatedTask);
  }
  await saveUser(user);
}

/**
 * @param {User} user
 * @param {string} taskId
 * @returns {Promise<void>}
 */
async function removeTask (user, taskId) {
  await simulateServerWait();
  const taskIndex = user.tasks?.findIndex(task => task.id === taskId);
  if (taskIndex >= 0) {
    user.tasks.splice(taskIndex, 1);
  }
  await saveUser(user);
}

module.exports = {
  login,
  watchUser,
  saveUser,
  loadTask,
  saveTask,
  removeTask
};
