Polymer({

  is: 'TDO-MisPreguntas',

  properties: {
    idPregunta: {
      type: Number,
      notify: true,
      value: 0
    },
  },

  behaviors: [AjaxBehavior],

  verPregunta: function (e) {
    this.idPregunta = e.target.getAttribute("data-id");
  }

});
