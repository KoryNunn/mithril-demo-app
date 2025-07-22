const getApp = require('./getApp');
const test = require('node:test');
const assert = require('node:assert');
const automage = require('automage');

test('Header has expected links', { plan: 1 }, async (t) => {
	const { dom } = await getApp(t);

  assert.ok(await automage.get(dom.window.document.body, 'Home', 'link'), 'Home link visible');
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
  await automage.get(dom.window.document.body, 'enabled', 'Save', 'button', 2000);
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
  await automage.get(dom.window.document.body, 'enabled', 'Save', 'button', 2000);
  await automage.click(dom.window.document.body, 'Home', 'link');
  const currentText = (await automage.get(dom.window.document.body, /Omg only .* until your birthday!/, 'text')).textContent;
  await new Promise(resolve => setTimeout(resolve, 2000));
  const newText = (await automage.get(dom.window.document.body, /Omg only .* until your birthday!/, 'text')).textContent;
  assert.notEqual(newText, currentText, 'Birthday countdown changes over time');
});