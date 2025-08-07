const getDom = require('./getDom');
const { emitDomEvent } = require('mithril-emittable');

module.exports = async function (t, beforeAppMount) {
  let dom = null;

  t.after(async function () {
    emitDomEvent(dom?.window.document.body, 'demount');
  });

  dom = (await getDom(t)).dom;
  global.window = dom.window;
  dom.window.SIMULATED_SERVER_WAIT = 1;
  beforeAppMount && await beforeAppMount(dom);
  const renderApp = require('../');
  renderApp(dom.window.document.body);

  return {
    dom
  };
};
