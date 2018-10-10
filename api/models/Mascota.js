/**
 * Mascota.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  connection: 'someMongodbServer',
  attributes: {
    nombre: {
      type: "string",
      size: 45,
      required: true,
      minLength: 2
    },

    fechaNacimiento: {
      type: "date"
    },

    sexo: {
      type: "string",
      enum: ["M", "F"]
    },

    usuarioId: {
      model: 'usuario',
      required: true
    },

    razaId: {
      model: 'raza',
      required: true
    },

    pregunta: {
      collection: 'pregunta',
      via: 'mascotaId'
    }
  },

  checkOwner: function (options, cb) {
    Mascota.findOne(options)
      .then(mascota => cb(null, !!mascota))
      .catch(cb);
  },

  getUserPets: (options, cb) => {
    Mascota.find({
      usuarioId: options.usuarioId
    })
      .then(mascotas => cb(null, mascotas))
      .catch(cb);
  },

};
