var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');

/**
 * Se encarga de manipular la lógica de los tokens.
 */
module.exports = {

  /**
   * Hash the password field of the passed user.
   */
  hashPassword: contra => bcrypt.hashSync(contra),

  /**
   * Compare user password hash with unhashed password
   * @returns boolean indicating a match
   */
  comparePassword: (unhashPwd, hashPwd) => bcrypt.compareSync(unhashPwd, hashPwd),

  /**
   * Create a token based on the passed user
   * @param usuario
   * @param diasExpiracion
   */
  createToken: (usuario, diasExpiracion) => jwt.sign(usuario, sails.config.jwtSettings.secret, {
    algorithm: sails.config.jwtSettings.algorithm,
    expiresIn: diasExpiracion || sails.config.jwtSettings.expiresInDays,
    issuer: sails.config.jwtSettings.issuer,
    audience: sails.config.jwtSettings.audience
  }),

  /**
   * Create a token based on the passed user
   * @param usuario
   * @param diasExpiracion
   */
  createTokenAdmin: (usuario, diasExpiracion) => jwt.sign(usuario, sails.config.jwtSettingsAdmin.secret, {
    algorithm: sails.config.jwtSettingsAdmin.algorithm,
    expiresIn: diasExpiracion || sails.config.jwtSettingsAdmin.expiresInDays,
    issuer: sails.config.jwtSettingsAdmin.issuer,
    audience: sails.config.jwtSettingsAdmin.audience
  }),

  /**
   * Create a token based on the passed user
   * @param usuario
   * @param diasExpiracion
   */
  createTokenConfirm: (usuario, diasExpiracion) => jwt.sign(usuario, sails.config.jwtSettingsConfirm.secret, {
    algorithm: sails.config.jwtSettingsConfirm.algorithm,
    expiresIn: diasExpiracion || sails.config.jwtSettingsConfirm.expiresInDays,
    issuer: sails.config.jwtSettingsConfirm.issuer,
    audience: sails.config.jwtSettingsConfirm.audience
  }),

  verifyTokenConfirm: token => {
    try {
      return jwt.verify(token, sails.config.jwtSettingsConfirm.secret);
    } catch (err) {
      return null;
    }
  }
  //process.env
};
