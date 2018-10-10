var passport = require('passport');

/**
 * TokenController
 *
 * @description :: Server-side logic for managing Tokens
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {

  validarToken: (req, res) => {
    if (req.host !== "localhost") {
      return res.forbidden({
        idMensaje: 1
      });
    }

    passport.authenticate('jwt', (error, usuario, info) => {
      if (error) { //Si hay algún error con los datos del usuario.
        return res.serverError({
          error: error,
          codigo: 1
        }); //Se envía una respuesta de error al cliente.
      }

      if (!usuario) { //Si no se encontró al usuario.
        return res.forbidden({
          codigo: 2
        });
      }

      Token.findOneByToken(req.param("token")).then(token => { //Se busca el token recibido en la base de datos.
        if (!token || !token.valido) { //Se comprueba si se encontró el token en la base de datos y si es un token válido.
          return res.forbidden({ //Se devuelve un mensaje de prohibido al cliente.
            codigo: 2
          });
        }

        res.ok({
          codigo: 3
        });
      }).catch(error => res.serverError(error));
    })(req, res);

  }

};
