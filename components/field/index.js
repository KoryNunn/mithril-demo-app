function createFieldBinder (emit, data) {
  return function bindInput (key, parse = x => x, format = x => x) {
    return {
      oninput: event => {
        if (data && typeof event.target?.value === 'string') {
          data[key] = parse(event.target.value);
          emit('redraw');
        }
      },
      value: data && format(data[key])
    };
  };
}

function getFieldErrors (path, error) {
  return error?.issues?.filter(issue => issue.path?.map(item => item.key).join('.') === [].concat(path).join('.'))?.map(issue => issue.message);
}

function handleForm (emit) {
  let loading;
  let error;

  return function (data) {
    const bindInput = createFieldBinder(emit, data);

    return {
      bindInput: (...args) => {
        const fieldProperties = bindInput(...args);
        return {
          ...fieldProperties,
          disabled: fieldProperties.disabled || loading
        };
      },
      bindForm: function ({ onsubmit, ...attrs }) {
        return {
          disabled: loading || attrs.disabled,
          inert: loading || attrs.inert,
          onsubmit: async function (event) {
            event.preventDefault();
            loading = true;
            error = null;
            emit('redraw');

            try {
              await onsubmit(event);
            } catch (lastError) {
              error = lastError;
            }
            loading = false;
            emit('redraw');
          }
        };
      },
      loading,
      getFieldErrors: path => getFieldErrors(path, error)
    };
  };
}

module.exports = {
  createFieldBinder,
  getFieldErrors,
  handleForm
};
