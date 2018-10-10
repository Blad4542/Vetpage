/**
 * Respuesta.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  connection: 'someMongodbServer',
  attributes: {
    respuesta: {
      type: "string",
      size: 16777215,
      required: true,
      minLength: 10
    },

    usuarioId: {
      model: 'usuario'
    },

    preguntaId: {
      model: 'pregunta',
      required: true
    }
  }
};
