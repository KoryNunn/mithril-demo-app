const { JSDOM } = require('jsdom');

async function getDom (t, url = 'http://localhost/') {
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    pretendToBeVisual: true,
    url
  });

  t.after(() => {
    dom.window.close();
  });

  dom.window.fetch = fetch;

  global.prompt = dom.window.prompt = function () {
    return global.nextPrompt;
  };

  return {
    dom
  };
}

module.exports = getDom;
