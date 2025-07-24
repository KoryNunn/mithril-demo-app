const m = require('mithril/hyperscript');
const mithrilRender = require('mithril/render');

function mount (target, view) {
  let nextDraw;

  function redraw () {
    nextDraw = nextDraw || Promise.resolve().then(() => {
      nextDraw = null;

      mithrilRender(
        target,
        view()
      );
    });

    return nextDraw;
  }

  redraw();

  return redraw;
}

function render (target) {
  const { App } = require('./components/app');
  let demount;

  const redraw = mount(target, () => {
    if (demount) {
      return null;
    }

    return m(App);
  });

  target.addEventListener('redraw', redraw);

  target.addEventListener('click', event => {
    const anchor = event.target.closest('a');

    if (anchor && !anchor.hasAttribute('download') && !anchor.getAttribute('target')) {
      event.preventDefault();
      window.history.pushState(null, null, anchor.href);
      redraw();
    }
  });

  const window = target.ownerDocument.defaultView;

  window.addEventListener('navigate', event => {
    if (event.detail.type === 'back') {
      window.history.length ? window.history.back() : window.history.replaceState(null, null, event.detail.url);
    } else {
      window.history[event.detail.type || 'pushState'](null, null, event.detail.url);
    }
    redraw();
  });

  window.addEventListener('popstate', event => {
    redraw();
  });

  window.addEventListener('demount', () => {
    demount = true;
    redraw();
  });
}

/* node:coverage ignore next 5 */
if (!require.main) {
  window.addEventListener('DOMContentLoaded', () => {
    render(window.document.body);
  });
}

module.exports = render;
