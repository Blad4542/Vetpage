Polymer({

  is: 'TDO-DetallePregunta',

  properties: {
    idPregunta: {
      type: Number,
      value: 0,
      notify: true,
      observer: "onPreguntaChange"
    },
    respuesta: {
      type: Object,
      value: () => ({})
    }
  },

  behaviors: [AjaxBehavior],

  onPreguntaChange: function (newValue, oldValue) {
    if (this.idPregunta) {
      let fGetPregunta;

      fGetPregunta = this.$.getPregunta;

      fGetPregunta.params = {
        id: this.idPregunta
      };
      fGetPregunta.generateRequest();

      let fGetRespuestas;

      fGetRespuestas = this.$.getRespuestas;

      fGetRespuestas.params = {
        where: {preguntaId: this.idPregunta}
      };
      fGetRespuestas.generateRequest();
    }
  },

});
