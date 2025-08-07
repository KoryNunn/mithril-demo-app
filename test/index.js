const getApp = require('./getApp');
const test = require('node:test');
const automage = require('automage');

test('Header has expected links', async (t) => {
  t.plan(1);
  const { dom } = await getApp(t);

  t.assert.ok(await automage.get(dom.window.document.body, 'Home', 'link'), 'Home link visible');
});

test('Navigation works', async (t) => {
  t.plan(2);
  const { dom } = await getApp(t);

  await automage.click(dom.window.document.body, 'About', 'link');
  t.assert.ok(await automage.get(dom.window.document.body, 'About', 'heading'), 'Navigated to about page');
  dom.window.history.back();
  t.assert.ok(await automage.get(dom.window.document.body, 'Home', 'heading'), 'Navigated back to home page');
});

test('log in button shown when not logged in', async (t) => {
  t.plan(1);
  const { dom } = await getApp(t);

  t.assert.ok(await automage.get(dom.window.document.body, 'Login', 'button'), 'Login button visible');
});

test('log in button not shown when logged in', async (t) => {
  t.plan(1);
  const { dom } = await getApp(t);

  global.nextPrompt = 'Bob';
  await automage.click(dom.window.document.body, 'Login', 'button');
  t.assert.ok(await automage.isMissing(dom.window.document.body, 'Login', 'button'), 'Login button missing after login');
});

test('Home shows displayName of logged in user', async (t) => {
  t.plan(1);
  const { dom } = await getApp(t);

  global.nextPrompt = 'Bob';
  await automage.click(dom.window.document.body, 'Login', 'button');
  t.assert.ok(await automage.get(dom.window.document.body, 'Bob', 'text'), 'displayName shown');
});

test('Home shows tell me about yourself when no date of birth set', async (t) => {
  t.plan(1);
  const { dom } = await getApp(t);

  global.nextPrompt = 'Bob';
  await automage.click(dom.window.document.body, 'Login', 'button');
  t.assert.ok(await automage.get(dom.window.document.body, 'Tell me about yourself', 'link'), 'Tell me about yourself link shown');
});

test('About shows errors when fields are invalid', async (t) => {
  t.plan(2);
  const { dom } = await getApp(t);

  global.nextPrompt = 'Bob';
  await automage.click(dom.window.document.body, 'Login', 'button');
  await automage.click(dom.window.document.body, 'About', 'link');
  await automage.changeValue(dom.window.document.body, 'Display Name', 'field', '');
  await automage.click(dom.window.document.body, 'Save', 'button');
  t.assert.ok(await automage.get(dom.window.document.body, 'Display name cannot be empty', 'text'), 'Error shown for invalid display name field');
  await automage.changeValue(dom.window.document.body, 'Display Name', 'field', 'Bob');
  await automage.changeValue(dom.window.document.body, 'Birthday', 'field', new Date('3000-1-1'));
  await automage.click(dom.window.document.body, 'Save', 'button');
  t.assert.ok(await automage.get(dom.window.document.body, 'Date of birth must be in the past', 'text'), 'Error shown for invalid date of birth field');
});

test('Home shows birthday countdown when date of birth set', async (t) => {
  t.plan(1);
  const { dom } = await getApp(t);

  global.nextPrompt = 'Bob';
  await automage.click(dom.window.document.body, 'Login', 'button');
  await automage.click(dom.window.document.body, 'Tell me about yourself', 'link');
  await automage.changeValue(dom.window.document.body, 'Birthday', 'field', new Date('2000-1-1'));
  await automage.click(dom.window.document.body, 'Save', 'button');
  await automage.get(dom.window.document.body, 'enabled', 'Save', 'button');
  await automage.click(dom.window.document.body, 'Home', 'link');
  t.assert.ok(await automage.get(dom.window.document.body, /Omg only .* until your birthday!/, 'text'), 'Birthday countdown shown');
});

test('Home shows birthday countdown changes over time', async (t) => {
  t.plan(1);
  const { dom } = await getApp(t);

  global.nextPrompt = 'Bob';
  await automage.click(dom.window.document.body, 'Login', 'button');
  await automage.click(dom.window.document.body, 'Tell me about yourself', 'link');
  await automage.changeValue(dom.window.document.body, 'Birthday', 'field', new Date('2000-1-1'));
  await automage.click(dom.window.document.body, 'Save', 'button');
  await automage.get(dom.window.document.body, 'enabled', 'Save', 'button');
  await automage.click(dom.window.document.body, 'Home', 'link');
  const currentText = (await automage.get(dom.window.document.body, /Omg only .* until your birthday!/, 'text')).textContent;
  t.assert.ok(await automage.isMissing(dom.window.document.body, currentText, 'text', 1100), 'Birthday countdown changes over time');
});

test('Can add tasks', async (t) => {
  t.plan(6);
  const { dom } = await getApp(t);

  global.nextPrompt = 'Bob';
  await automage.click(dom.window.document.body, 'Login', 'button');
  await automage.click(dom.window.document.body, 'Tasks', 'link');
  t.assert.ok(await automage.get(dom.window.document.body, 'You have no tasks', 'heading'), 'Tasks pages shows no tasks');
  await automage.click(dom.window.document.body, 'Add task', 'button');
  await automage.changeValue(dom.window.document.body, 'Name', 'field', 'Cool new task');
  await automage.click(dom.window.document.body, 'Save', 'button');
  t.assert.ok(await automage.get(dom.window.document.body, 'Tasks', 'heading'), 'Navigated back to task list after save');
  t.assert.ok(await automage.get(dom.window.document.body, 'You have 1 task', 'heading'), 'Tasks pages shows one task');
  t.assert.ok(await automage.get(dom.window.document.body, 'Cool new task', 'text'), 'Cool new task is in the list');
  await automage.click(dom.window.document.body, 'Add task', 'button');
  await automage.changeValue(dom.window.document.body, 'Name', 'field', 'Even cooler new task');
  await automage.click(dom.window.document.body, 'Save', 'button');
  t.assert.ok(await automage.get(dom.window.document.body, 'Even cooler new task', 'text'), 'Cool new task is in the list');
  t.assert.ok(await automage.get(dom.window.document.body, 'You have 2 tasks', 'heading'), 'Tasks pages shows two tasks');
});

test('Tast edit shows errors when fields are invalid', async (t) => {
  t.plan(1);
  const { dom } = await getApp(t);

  global.nextPrompt = 'Bob';
  await automage.click(dom.window.document.body, 'Login', 'button');
  await automage.click(dom.window.document.body, 'Tasks', 'link');
  await automage.click(dom.window.document.body, 'Add task', 'button');
  await automage.changeValue(dom.window.document.body, 'Name', 'field', '');
  await automage.click(dom.window.document.body, 'Save', 'button');
  t.assert.ok(await automage.get(dom.window.document.body, 'Name cannot be empty', 'text'), 'Error shown for invalid name field');
});

test('Can edit a task', async (t) => {
  t.plan(3);
  const { dom } = await getApp(t);

  global.nextPrompt = 'Bob';
  await automage.click(dom.window.document.body, 'Login', 'button');
  await automage.click(dom.window.document.body, 'Tasks', 'link');
  await automage.click(dom.window.document.body, 'Add task', 'button');
  await automage.changeValue(dom.window.document.body, 'Name', 'field', 'Cool new task');
  await automage.click(dom.window.document.body, 'Save', 'button');
  await automage.get(dom.window.document.body, 'Tasks', 'heading');
  const coolNewTask = await automage.get(dom.window.document.body, 'Cool new task', 'area');
  await automage.click(coolNewTask, 'edit', 'link');
  t.assert.ok(await automage.get(dom.window.document.body, 'Cool new task', 'field'), 'Existing task data loaded');
  await automage.changeValue(dom.window.document.body, 'Name', 'field', 'Cool edited task');
  await automage.click(dom.window.document.body, 'Save', 'button');
  await automage.get(dom.window.document.body, 'Tasks', 'heading');
  t.assert.ok(await automage.get(dom.window.document.body, 'Cool edited task', 'text'), 'Cool edited task is in the list');
  t.assert.ok(await automage.isMissing(dom.window.document.body, 'Cool new task', 'text'), 'Cool new task is not in the list');
});

test('Can remove a task', async (t) => {
  t.plan(1);
  const { dom } = await getApp(t);

  global.nextPrompt = 'Bob';
  await automage.click(dom.window.document.body, 'Login', 'button');
  await automage.click(dom.window.document.body, 'Tasks', 'link');
  await automage.click(dom.window.document.body, 'Add task', 'button');
  await automage.changeValue(dom.window.document.body, 'Name', 'field', 'Cool new task');
  await automage.click(dom.window.document.body, 'Save', 'button');
  await automage.get(dom.window.document.body, 'Tasks', 'heading');
  const coolNewTask = await automage.get(dom.window.document.body, 'Cool new task', 'area');
  await automage.click(coolNewTask, 'X', 'button');
  t.assert.ok(await automage.isMissing(dom.window.document.body, 'Cool new task', 'text'), 'Cool new task is not in the list');
});

test('Can mark a task as done and not done', async (t) => {
  t.plan(4);
  const { dom } = await getApp(t);

  global.nextPrompt = 'Bob';
  await automage.click(dom.window.document.body, 'Login', 'button');
  await automage.click(dom.window.document.body, 'Tasks', 'link');
  await automage.click(dom.window.document.body, 'Add task', 'button');
  await automage.changeValue(dom.window.document.body, 'Name', 'field', 'Task to complete');
  await automage.click(dom.window.document.body, 'Save', 'button');
  await automage.get(dom.window.document.body, 'Tasks', 'heading');
  const taskArea = await automage.get(dom.window.document.body, 'Task to complete', 'area');
  await automage.click(taskArea, 'Mark as done', 'button');
  t.assert.ok(await automage.get(taskArea, 'done', 'text'), 'Task marked as done');
  await automage.click(taskArea, 'Mark as not done', 'button');
  t.assert.ok(await automage.isMissing(taskArea, 'done', 'text'), 'Task marked as not done');
  t.assert.ok(await automage.get(taskArea, 'Mark as done', 'button'), 'Mark as done button visible again');
  await automage.click(taskArea, 'Mark as done', 'button');
  t.assert.ok(await automage.get(taskArea, 'Mark as not done', 'button'), 'Mark as not done button visible again');
});

test('User state is loaded from localStorage', async (t) => {
  t.plan(1);
  const { dom } = await getApp(t, dom => {
    window.localStorage.setItem('mithril-demo-user', JSON.stringify({
      displayName: 'John',
      tasks: []
    }));
  });

  t.assert.ok(await automage.get(dom.window.document.body, 'John', 'text'), 'User was already logged in');
});
