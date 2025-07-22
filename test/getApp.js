const getDom = require('./getDom');
const { emitDomEvent } = require('mithril-emittable');

module.exports = async function(t) {
  let dom;

  t.after(async function() {
    emitDomEvent(dom.window.document.body, 'demount');
  });

	dom = (await getDom(t)).dom;
  global.window = dom.window;
	const renderApp = require('../');
  renderApp(dom.window.document.body);

  return {
    dom
  };
}