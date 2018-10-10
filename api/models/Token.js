function beforeCU(values, cb) {
  Usuario.isVeterinario(values, (err, isVeterinario) => {
    if (err) {
      return cb(err);
    }

    let object;
    object = {
      usuarioId: values.usuarioId,
      isVeterinario: isVeterinario
    };

    object.isRefresh = false;
    values.token = CipherService.createToken(object);

    object.isRefresh = true;
    values.refreshToken = CipherService.createToken(object, "30d");

    cb(values.token === "ERR" || values.refreshToken === "ERR" ? {
        msg: "Error al crear algún token",
        invalidAttributes: true
      } : undefined);
  })
}

/**
 * Token.js
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
    },
    refreshToken: {
      type: "string",
      unique: true
    },
    valido: {
      type: "boolean",
      required: true,
      defaultsTo: true
    }
  },

  beforeCreate: beforeCU,
  beforeUpdate: beforeCU

};

