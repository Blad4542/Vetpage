/**
 * UsuarioController
 *
 * @description :: Server-side logic for managing usuarios
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  serVeterinario: (req, res) => {
    Veterinario.create({usuarioId: req.usuario.usuarioId})
      .then(veterinario => MessageService.send(res, MessageService.messages.correctVeterinary))
      .catch(err => MessageService.sendError(res, err));
  }

};
