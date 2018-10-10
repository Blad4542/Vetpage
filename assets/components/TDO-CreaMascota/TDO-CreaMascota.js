Polymer({

  is: 'TDO-CreaMascota',

  properties: {
    date: {
      type: Date
    },
    mensajes: {
      type: String
    }
  },

  behaviors: [AjaxBehavior],

  onValueTipoMascotaChanged: function (e) {
    if (e.target) {
      let id;

      id = e.target.value;
      if (id) {
        let fGetRaza;

        fGetRaza = this.$.getRaza;

        fGetRaza.params = {
          where: {tipoMascotaId: id}
        };
        fGetRaza.generateRequest();
      }
    }
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

});
