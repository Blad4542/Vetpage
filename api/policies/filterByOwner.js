/**
 * filterByOwner Filtra con query.
 * @description :: Policy to inject user in req via JSON Web Token
 */

module.exports = (req, res, next) => {
  if (!req.query) {
    req.query = {};
  }

  req.query.where = {
    usuarioId: req.usuario.usuarioId
  };

  next();
};
