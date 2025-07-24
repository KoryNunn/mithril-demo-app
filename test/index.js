const getApp = require('./getApp');
const test = require('node:test');
const assert = require('node:assert');
const automage = require('automage');

test('Header has expected links', { plan: 1 }, async (t) => {
  const { dom } = await getApp(t);

  assert.ok(await automage.get(dom.window.document.body, 'Home', 'link'), 'Home link visible');
});

test('Navigation works', { plan: 2 }, async (t) => {
  const { dom } = await getApp(t);

  await automage.click(dom.window.document.body, 'About', 'link');
  assert.ok(await automage.get(dom.window.document.body, 'About', 'heading'), 'Navigated to about page');
  dom.window.history.back();
  assert.ok(await automage.get(dom.window.document.body, 'Home', 'heading'), 'Navigated back to home page');
});

test('log in button shown when not logged in', { plan: 1 }, async (t) => {
  const { dom } = await getApp(t);

  assert.ok(await automage.get(dom.window.document.body, 'Login', 'button'), 'Login button visible');
});

test('log in button not shown when logged in', { plan: 1 }, async (t) => {
  const { dom } = await getApp(t);

  global.nextPrompt = 'Bob';
  await automage.click(dom.window.document.body, 'Login', 'button');
  assert.ok(await automage.isMissing(dom.window.document.body, 'Login', 'button'), 'Login button missing after login');
});

test('Home shows displayName of logged in user', { plan: 1 }, async (t) => {
  const { dom } = await getApp(t);

  global.nextPrompt = 'Bob';
  await automage.click(dom.window.document.body, 'Login', 'button');
  assert.ok(await automage.get(dom.window.document.body, 'Bob', 'text'), 'displayName shown');
});

test('Home shows tell me about yourself when no date of birth set', { plan: 1 }, async (t) => {
  const { dom } = await getApp(t);

  global.nextPrompt = 'Bob';
  await automage.click(dom.window.document.body, 'Login', 'button');
  assert.ok(await automage.get(dom.window.document.body, 'Tell me about yourself', 'link'), 'Tell me about yourself link shown');
});

test('Home shows birthday countdown when date of birth set', { plan: 1 }, async (t) => {
  const { dom } = await getApp(t);

  global.nextPrompt = 'Bob';
  await automage.click(dom.window.document.body, 'Login', 'button');
  await automage.click(dom.window.document.body, 'Tell me about yourself', 'link');
  await automage.changeValue(dom.window.document.body, 'Birthday', 'field', new Date('2000-1-1'));
  await automage.click(dom.window.document.body, 'Save', 'button');
  await automage.get(dom.window.document.body, 'enabled', 'Save', 'button');
  await automage.click(dom.window.document.body, 'Home', 'link');
  assert.ok(await automage.get(dom.window.document.body, /Omg only .* until your birthday!/, 'text'), 'Birthday countdown shown');
});

test('Home shows birthday countdown changes over time', { plan: 1 }, async (t) => {
  const { dom } = await getApp(t);

  global.nextPrompt = 'Bob';
  await automage.click(dom.window.document.body, 'Login', 'button');
  await automage.click(dom.window.document.body, 'Tell me about yourself', 'link');
  await automage.changeValue(dom.window.document.body, 'Birthday', 'field', new Date('2000-1-1'));
  await automage.click(dom.window.document.body, 'Save', 'button');
  await automage.get(dom.window.document.body, 'enabled', 'Save', 'button');
  await automage.click(dom.window.document.body, 'Home', 'link');
  const currentText = (await automage.get(dom.window.document.body, /Omg only .* until your birthday!/, 'text')).textContent;
  // Wait for the text to update
  await new Promise(resolve => setTimeout(resolve, 1000));
  const newText = (await automage.get(dom.window.document.body, /Omg only .* until your birthday!/, 'text')).textContent;
  assert.notEqual(newText, currentText, 'Birthday countdown changes over time');
});

test('Can add tasks', { plan: 3 }, async (t) => {
  const { dom } = await getApp(t);

  global.nextPrompt = 'Bob';
  await automage.click(dom.window.document.body, 'Login', 'button');
  await automage.click(dom.window.document.body, 'Tasks', 'link');
  await automage.click(dom.window.document.body, 'Add task', 'button');
  await automage.changeValue(dom.window.document.body, 'Name', 'field', 'Cool new task');
  await automage.click(dom.window.document.body, 'Save', 'button');
  assert.ok(await automage.get(dom.window.document.body, 'Tasks', 'heading'), 'Navigated back to task list after save');
  assert.ok(await automage.get(dom.window.document.body, 'Cool new task', 'text'), 'Cool new task is in the list');
  await automage.click(dom.window.document.body, 'Add task', 'button');
  await automage.changeValue(dom.window.document.body, 'Name', 'field', 'Even cooler new task');
  await automage.click(dom.window.document.body, 'Save', 'button');
  assert.ok(await automage.get(dom.window.document.body, 'Even cooler new task', 'text'), 'Cool new task is in the list');
});

test('Can edit a task', { plan: 3 }, async (t) => {
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
  assert.ok(await automage.get(dom.window.document.body, 'Cool new task', 'field'), 'Existing task data loaded');
  await automage.changeValue(dom.window.document.body, 'Name', 'field', 'Cool edited task');
  await automage.click(dom.window.document.body, 'Save', 'button');
  await automage.get(dom.window.document.body, 'Tasks', 'heading');
  assert.ok(await automage.get(dom.window.document.body, 'Cool edited task', 'text'), 'Cool edited task is in the list');
  assert.ok(await automage.isMissing(dom.window.document.body, 'Cool new task', 'text'), 'Cool new task is not in the list');
});

test('Can remove a task', { plan: 1 }, async (t) => {
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
  assert.ok(await automage.isMissing(dom.window.document.body, 'Cool new task', 'text'), 'Cool new task is not in the list');
});
