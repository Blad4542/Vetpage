/**
 * filterByOwner Filtra con query.
 * @description :: Policy to inject user in req via JSON Web Token
 */

module.exports = (req, res, next) => {
  Pregunta.hasAnswers({
    id: req.params["id"]
  }, (err, response) => {
    if (err) {
      return MessageService.sendError(res, err);
    }

    if (!response) {
      return next();
    }

    MessageService.send(res, MessageService.messages.lockedQuestion);
  });
};
