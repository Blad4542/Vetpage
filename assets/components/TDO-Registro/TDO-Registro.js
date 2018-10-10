Polymer({

  is: 'TDO-Registro',

  properties: {
    date: {
      type: Date
    },
    disableNumDoc: {
      type: Boolean,
      value: true
    }
  },

  behaviors: [AjaxBehavior],

  beforeSubmit: function (event) {
    console.log(JSON.stringify(event.detail));
  },

  onPreSubmit: function (event) {
    event.target.request.body.fechaNacimiento = this.date;
    this._onPreSubmit(event);
  },

  onResponse: function (event, request) {
    this._onResponse(event, request);
    if (request.xhr.status === 200) {
      this._reset(event);
    }
  },

  onTipoDocIdChange: function (event) {
    this.disableNumDoc = !event.target.value;
  }

});
