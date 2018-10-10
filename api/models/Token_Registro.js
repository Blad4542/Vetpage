/**
 * Token_Registro.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  connection: 'someMongodbServer',

  migrate: 'safe',

  attributes: {
    usuarioId: {
      model: 'usuario',
      required: true
    },
    token: {
      type: "string",
      unique: true
    }
  },

  beforeCreate: (values, cb) => {
    values.token = CipherService.createTokenConfirm({usuarioId: values.usuarioId});

    cb(values.token === "ERR" || values.refreshToken === "ERR" ? {msg: "Error al crear el token", invalidAttributes: true} : undefined);
  }
};

