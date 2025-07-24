async function simulateServerWait () {
  await new Promise(resolve => setTimeout(resolve, 10));
}

async function login (displayName) {
  await simulateServerWait();
  const loggedInUserData = window.localStorage.getItem('mithril-demo-user');
  const user = (loggedInUserData && JSON.parse(loggedInUserData)) || { displayName };
  window.localStorage.setItem('mithril-demo-user', JSON.stringify(user));
  return user;
}

async function loadLoggedInUser () {
  await simulateServerWait();
  const loggedInUserData = window.localStorage.getItem('mithril-demo-user');
  const user = loggedInUserData ? JSON.parse(loggedInUserData) : null;
  return user;
}

async function saveUser (user, updatedUserData) {
  // Simulate server call.
  await simulateServerWait();
  if (updatedUserData) {
    Object.assign(user, updatedUserData);
  }
  window.localStorage.setItem('mithril-demo-user', JSON.stringify(user));
}

async function loadTask (user, taskId) {
  // Simulate server call.
  await simulateServerWait();
  const task = user.tasks?.find(task => task.id === taskId);

  return task;
}

async function saveTask (user, taskData) {
  let task = await loadTask(user, taskData?.id);
  if (!task) {
    task = { id: String(Math.round(Math.random() * 1e10)) };
    user.tasks = user.tasks || [];
    user.tasks.push(task);
  }
  Object.assign(task, taskData);
  await saveUser(user);
}

async function removeTask (user, taskId) {
  // Simulate server call.
  await simulateServerWait();
  const taskIndex = user.tasks?.findIndex(task => task.id === taskId);

  if (taskIndex >= 0) {
    user.tasks.splice(taskIndex, 1);
  }

  await saveUser(user);
}

module.exports = {
  login,
  loadLoggedInUser,
  saveUser,
  loadTask,
  saveTask,
  removeTask
};
