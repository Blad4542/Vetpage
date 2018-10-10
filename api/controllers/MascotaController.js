/**
 * MascotaController
 *
 * @description :: Server-side logic for managing mascotas
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  misMascotas: (req, res) => {
    Mascota.getUserPets({
      usuarioId: req.usuario.usuarioId
    }, (err, mascotas) => {
      if (err) {
        return MessageService.sendError(res, err);
      }

      if (!mascotas) {
        return MessageService.send(res, MessageService.messages.userWithoutPets);
      }

      MessageService.send(res, mascotas);
    });
  }
};

