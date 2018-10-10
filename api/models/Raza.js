/**
 * Raza.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  connection: 'someMongodbServer',
  autoCreatedAt: false,
  autoUpdatedAt: false,

  attributes: {
    descripcion: {
      type: "string",
      size: 45,
      required: true,
      minLength: 4
    },

    mascota: {
      collection: 'mascota',
      via: 'razaId'
    },

    tipoMascotaId: {
      model: 'tipo_mascota',
      required: true
    }
  }
};
