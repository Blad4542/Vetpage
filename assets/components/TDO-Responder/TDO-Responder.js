Polymer({

  is: 'TDO-Responder',

  properties: {
    idPregunta: {
      type: Number,
      value: 0,
      notify: true
    },
  },

  behaviors: [AjaxBehavior],

  onPreSubmit: function (event) {
    event.target.request.body.preguntaId = this.idPregunta;
    this._onPreSubmit(event);
  },

  onResponse: function (event, request) {
    this._onResponse(event, request);
    if (request.xhr.status === 200 || request.xhr.status === 201) {
      this._reset(event);
    }
  },

});
