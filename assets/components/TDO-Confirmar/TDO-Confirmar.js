Polymer({

  is: 'TDO-Confirmar',

  properties: {
    token: {
      type: String,
      value: () => window.location.toString().split("/").pop()
    },
  },

  behaviors: [AjaxBehavior],

  onResponse: function (event, request) {
    this._onResponse(event, request);

    if (request.xhr.status === 200) {
      let response;

      response = request.xhr.response;

      if (response.correo) {
        return setTimeout(() => window.location = "/", 3000);
      }

      console.log("Hubo un error en el sistema");
    }
  }

});
