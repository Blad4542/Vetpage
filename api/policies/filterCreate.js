/**
 * filterCreate Filtra la creción de una mascota.
 * @description :: Policy to inject user in req via JSON Web Token
 */

module.exports = (req, res, next) => {
  if (!req.body) {
    req.body = {};
  }
  req.body.usuarioId = req.usuario.usuarioId;
  next();
};
