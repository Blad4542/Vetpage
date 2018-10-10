Polymer({

  is: 'TDO-Login',

  properties: {
    prop1: {
      type: String,
      value: 'TDO-Login',
    },
  },

  behaviors: [AjaxBehavior],

  onResponse: function (event, request) {
    this._onResponse(event, request);

    let response;

    response = request.xhr.response;

    if (response.correo) {
      window.location = "/";
    }
  }

});
