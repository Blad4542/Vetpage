Polymer({

  is: 'TDO-SerVeterinario',

  properties: {},

  behaviors: [AjaxBehavior],

  serVeterinario: function () {
    let fSerVeterinario;

    fSerVeterinario = this.$.serVeterinario;



    fSerVeterinario.body = {};

    fSerVeterinario.generateRequest();
  },

});
