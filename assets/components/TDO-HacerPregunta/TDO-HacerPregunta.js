Polymer({

  is: 'TDO-HacerPregunta',

  properties: {
  },

  behaviors: [AjaxBehavior],

  onResponse: function (event, request) {
    this._onResponse(event, request);
    if (request.xhr.status === 200 || request.xhr.status === 201) {
      this._reset(event);
    }
  },

});
