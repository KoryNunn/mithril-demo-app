const emittable = require('mithril-emittable');
const { routemeup } = require('routemeup');

const Router = emittable(function (_, emit) {
  let doc;

  return {
    oncreate: ({ dom }) => { doc = dom.ownerDocument; emit('redraw'); },
    onupdate: ({ dom }) => { doc = dom?.ownerDocument; },
    view: ({ attrs: { routes } }) => {
      if (!doc) {
        return '';
      }

      const url = doc.defaultView.location.href;
      const route = routemeup(routes, {
        url
      });
      return [route?.controller(route?.tokens) || ''];
    }
  };
});

module.exports = { Router };
