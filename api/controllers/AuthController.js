var passport = require('passport');

/**
 * TokenController
 *
 * @description :: Server-side logic for managing Tokens
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {

  login: (req, res) => {
    passport.authenticate("local", function (err, usuario, info) {
      if (err) {
        return err.id ? MessageService.send(res, err) : MessageService.sendError(res, err);
      }

      if (!usuario) {
        //return MessageService.send(res, null, info && info.code, info && info.message);
        return MessageService.send(res, MessageService.messages.credentialError);
      }

      req.login(usuario, err => err ? MessageService.sendError(res, err) : MessageService.send(res, {correo: usuario.correo}));
    })(req, res);
  },

  logout: (req, res) => {
    req.logout();

    return MessageService.send(res, MessageService.messages.logoutMessage);
    /*Token.destroy({token: req.token})
     .then(token => MessageService.send(res, MessageService.messages.logoutMessage))
     .catch(err => MessageService.sendError(res, err));*/
  },

  register: (req, res) => {
    Usuario.findOneByCorreo(req.param("correo") || "")
      .then(usuario => !usuario ? Usuario.create(req.allParams()) : Promise.reject(MessageService.messages.userExists))
      .then(response => MessageService.send(res, MessageService.messages.successRegister))
      .catch(err => MessageService.sendError(res, err));
  },

  facebook: (req, res) => {
    passport.authenticate('facebook',
      {failureRedirect: '/login', scope: ["user_birthday", "email"]},
      (err, usuario) => {
        if (err) {
          return MessageService.sendError(res, err);
        }

        req.login(usuario, err => err ? MessageService.sendError(res, err) : res.redirect("/"));
      })(req, res);
  },

  confirm: (req, res) => {
    let payload;
    let registerToken;
    let usuario;

    registerToken = req.params["id"];
    payload = CipherService.verifyTokenConfirm(registerToken);

    if (payload) {
      Token_Registro.findOneByToken(registerToken).populate("usuarioId")
        .then(tokenBD => { //Se busca el token recibido en la base de datos.
          if (!tokenBD) { //Se comprueba si se encontró el token en la base de datos y si es un token válido.
            return MessageService.send(res, MessageService.messages.invalidToken); //Se devuelve un mensaje de prohibido al cliente.
          }

          usuario = tokenBD.usuarioId;

          usuario.isConfirmado = true;

          //Token.create({usuarioId: usuario.id})
          return Promise.all([usuario.save(), Token_Registro.destroy({usuarioId: usuario.id})]);
        })
        .then(response => {
          /*let tokenResponse;

           tokenResponse = response[1];

           MessageService.send(res, {
           token: tokenResponse.token,
           refreshToken: tokenResponse.refreshToken
           });*/
          req.login(usuario, err => err ? MessageService.sendError(res, err) : MessageService.send(res, {correo: usuario.correo}));
        })
        .catch(err => MessageService.sendError(res, err))//Se envía un mensaje de error al cliente.
    } else {
      MessageService.send(res, MessageService.messages.invalidToken);
    }
  },

  resendConfirm: (req, res) => {
    Usuario.findOneByCorreo(req.param("correo") || "").populate("tokensRegistro")
      .then(usuario => {
        if (usuario && usuario.tokensRegistro.length > 0) {
          MailerService.sendRegister({
            username: usuario.primerNombre,
            token: usuario.tokensRegistro[0].token,
            address: "http://localhost:1337/confirm",
            email: usuario.correo
          });
          return MessageService.send(res, MessageService.messages.successResend);
        }

        return MessageService.send(res, MessageService.messages.userNotExists);
      })
      .catch(err => MessageService.sendError(res, err));
  },

  changePwd: (req, res) => {
    Usuario.findOne(req.usuario.usuarioId)
      .then(usuario => {
        if (usuario) {
          let {oldPWD, newPWD} = req.allParams();

          if (CipherService.comparePassword(oldPWD, usuario.contrasena)) {
            usuario.contrasena = newPWD;
            return usuario.save();
          }
        }

        return Promise.reject({invalidAttributes: true});
      })
      .then(response => MessageService.send(res, MessageService.messages.successUpdate))
      .catch(err => MessageService.sendError(res, err));
  },

  refreshToken: (req, res) => {
    Token.update({refreshToken: req.token}, {usuarioId: req.usuario.usuarioId})
      .then(token => MessageService.send(res, {
        token: token[0].token,
        refreshToken: token[0].refreshToken
      }))
      .catch(err => MessageService.sendError(res, err))//Se envía un mensaje de error al cliente.
  },

  prueba: (req, res) => {

  }

};
