/**
 * Usuario.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
module.exports = {

  connection: 'someMongodbServer',
  attributes: {
    sexo: {
      type: "string",
      enum: ["M", "F"]
    },

    fechaNacimiento: {
      type: "date"
    },

    primerNombre: {
      type: "string",
      size: 45,
      required: true,
      minLength: 2
    },

    segundoNombre: {
      type: "string",
      size: 45,
      minLength: 2
    },

    primerApellido: {
      type: "string",
      size: 45,
      required: true,
      minLength: 2
    },

    segundoApellido: {
      type: "string",
      size: 45,
      minLength: 2
    },

    correo: {
      type: "email",
      size: 45,
      required: true,
      unique: true
    },

    contrasena: {
      type: "string",
      size: 4294967295
    },

    tipoDocId: {
      model: 'tipo_doc'
    },

    numeroIdentificacion: {
      type: "string",
      size: 45,
      minLength: 5
    },

    isConfirmado: {
      type: "boolean",
      default: false
    },

    veterinario: {
      collection: 'veterinario',
      via: 'usuarioId'
    },

    tokens: {
      collection: 'token',
      via: 'usuarioId'
    },

    tokensRegistro: {
      collection: 'token_registro',
      via: 'usuarioId'
    },

    mascota: {
      collection: 'mascota',
      via: 'usuarioId'
    },

    respuesta: {
      collection: 'respuesta',
      via: 'usuarioId'
    },

    usuarioFacebookId: {
      model: 'usuario_facebook',
      unique: true
    }
  },

  isVeterinario: (options, cb) => {
    Usuario.findOne(options.usuarioId).populate("veterinario")
      .then(user => cb(null, user && user.veterinario.length === 1))
      .catch(cb);
  },

  beforeCreate: (values, cb) => {
    if (!values.usuarioFacebookId) {
      if (!UtilsServerService.isValidPassword(values.contrasena)) {
        return cb({
          msg: "Contraseña inválida",
          invalidAttributes: true
        });
      } else {
        values.contrasena = CipherService.hashPassword(values.contrasena);
      }
    }

    if ((values.tipoDocId || values.numeroIdentificacion) && !(values.tipoDocId && values.numeroIdentificacion)) {
      return cb({
        msg: "Identificación inválida",
        invalidAttributes: true
      });
    }

    cb();
  },

  beforeUpdate: (values, cb) => {
    if ((values.tipoDocId || values.numeroIdentificacion) && !(values.tipoDocId && values.numeroIdentificacion)) {
      return cb({
        msg: "Identificación inválida",
        invalidAttributes: true
      });
    }

    if (!values.usuarioFacebookId && values.contrasena) {
      if (!UtilsServerService.isValidPassword(values.contrasena)) {
        return cb({
          msg: "Contraseña inválida",
          invalidAttributes: true
        });
      }

      Usuario.findOne(values.id)
        .then(usuario => {
          if (usuario && usuario.contrasena !== values.contrasena) {
            values.contrasena = CipherService.hashPassword(values.contrasena);
          }
          cb();
        })
        .catch(cb);
    } else {
      cb();
    }
  },

  afterCreate: (values, cb) => {
    if (!values.usuarioFacebookId) {
      Token_Registro.create({usuarioId: values.id})
        .then(tokenRegistro => {
          MailerService.sendRegister({
            username: values.primerNombre,
            token: tokenRegistro.token,
            address: "http://localhost:1337/confirm",
            email: values.correo
          });
        })
        .catch(err => sails.log.error(err));
    }
    cb();
  }

};
