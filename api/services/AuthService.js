var passport = require('passport');
/**
 * Se encarga de verificar la identidad.
 */
module.exports = {

  authUser: (req, res) => {
    return new Promise((resolve, reject) => {
      passport.authenticate('jwt', (error, usuario, info) => { //Se usa passport para comprobar que un usuario si esté logueado en el sistema.
        if (error) { //Si hay algún error con los datos del usuario.
          return reject(error); //Se envía una respuesta de error al cliente.
        }

        if (!usuario) { //Si no se encontró al usuario.
          return resolve(MessageService.messages.invalidToken); //Se envía que tiene prohíbido ingresar al recurso.
        }

        let token;

        token = req.headers.authorization.split(" ")[1]; //El token que se recibe en el encabezado de autorización.

        req.usuario = usuario; //Se asigna el usuario a la petición.
        req.token = token; //Se asigna el token a la petición.

        Token.findOneByToken(token).then(token => { //Se busca el token recibido en la base de datos.
          if (!token || !token.valido) { //Se comprueba si se encontró el token en la base de datos y si es un token válido.
            return resolve(MessageService.messages.invalidToken); //Se devuelve un mensaje de prohibido al cliente.
          }

          resolve({
            ok: true
          });
        }).catch(reject);//Se envía un mensaje de error al cliente.

      })(req, res);
    });
  }

};
