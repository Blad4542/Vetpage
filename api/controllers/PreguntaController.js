/**
 * PreguntaController
 *
 * @description :: Server-side logic for managing preguntas
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  misPreguntas: (req, res) => {
    Pregunta.getUserQuestions({
      usuarioId: req.usuario.usuarioId
    }, (err, preguntas) => {
      if (err) {
        return MessageService.sendError(res, err);
      }

      if (!preguntas) {
        return MessageService.send(res, MessageService.messages.userWithoutQuestions);
      }

      MessageService.send(res, preguntas);
    });
  }
};

