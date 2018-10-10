/**
 * isPetOwner Comprueba si un usuario es dueño de una mascota.
 * @description :: Policy to inject user in req via JSON Web Token
 */

module.exports = (req, res, next) => {
  Usuario.isVeterinario({
    usuarioId: req.usuario.usuarioId
  }, (err, response) => {
    if (err) {
      return MessageService.sendError(res, err);
    }

    if (response) {
      return next();
    }

    MessageService.send(res, MessageService.messages.forbiddenResource);
  })
};
