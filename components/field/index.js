module.exports = function createFieldBinder (emit, getData) {
  return function bindField (key, parse = x => x, format = x => x) {
    const data = getData();

    return {
      oninput: event => {
        if (data) {
          data[key] = parse(event.target.value);
          emit('redraw');
        }
      },
      value: data && format(data[key])
    };
  };
};
