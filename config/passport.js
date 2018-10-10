/**
 * Passport configuration file where you should configure strategies
 */
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

var EXPIRES_IN_DAYS = process.env.days || '7d';
var SECRET = process.env.tokenSecret || "4ukI0uIVnB3iI1yxj646fVXSE3ZVk4doZgz6fTbNg7jO41EAtl20J5F7Trtwe7OM";
var SECRET_ADMIN = process.env.tokenSecret || "4ukI0uIVnB3iI1yxj646fVXSE3ZVk4doZgz6fTbNg7jO41EAtl20J5F7Trtwe7ON";
var SECRET_CONFIRM = process.env.tokenSecret || "4ukI0uIVnB3iI1yxj646fVXSE3ZVk4doZgz6fTbNg7jO41EAtl20J5F7Trtwe7OL";
var ALGORITHM = "HS256";
var ISSUER = "admin@3dog1.pet";
var AUDIENCE = "3dog1.pet";
var JWT_FROM_REQUEST = ExtractJwt.fromAuthHeader();

/**
 * Configuration object for JWT strategy
 */
var JWT_STRATEGY_CONFIG = {
  secretOrKey: SECRET,
  issuer: ISSUER,
  audience: AUDIENCE,
  passReqToCallback: false,
  jwtFromRequest: JWT_FROM_REQUEST
};

var LOCAL_STRATEGY_CONFIG = {
  usernameField: 'correo',
  passwordField: 'contra',
  passReqToCallback: false
};

var FACEBOOK_STRATEGY_CONFIG = {
  clientID: '506953356026073', // your App ID
  clientSecret: '59e8157b44fdc739e2677a2164fc41f3', // your App Secret
  callbackURL: 'http://localhost:1337/api/auth/facebook/callback',
  profileFields: ['id', 'email', 'gender', 'name', 'birthday'],
  enableProof: true
};

/**
 * Triggers when user authenticates via JWT strategy
 */
function _onJwtStrategyAuth(payload, next) {
  return next(null, payload, {});
}

function _onLocalStrategyAuth(correo, contrasena, next) {
  Usuario.findOneByCorreo(correo || "").then(usuario => { //Se busca si el correo del usuario existe en el sistema.
    if (usuario) { //Si se encontró al usuario
      if (!usuario.isConfirmado) {
        return next(MessageService.messages.isntConfirmed, false, {});
      }

      if (!CipherService.comparePassword(contrasena, usuario.contrasena)) { //Se comprueba si el password enviado es correcto.
        return next(MessageService.messages.credentialError, false, {});
      }

      /*Token.create({usuarioId: usuario.id})
       .then(token => MessageService.send(res, {
       token: token.token,
       refreshToken: token.refreshToken
       })) //Se envía la información de acceso al cliente.
       .catch(err => MessageService.sendError(res, err)); //Se envía un error al cliente al intentar crear el token.*/

      next(null, usuario, {});
    } else {
      next(MessageService.messages.credentialError, false, {});
    }

  }).catch(err => next(err, false, {}));
}

function _onFacebookStrategyAuth(token, refreshToken, profile, done) {
  let correo;

  profile = profile._json;

  if (!profile.emails && !profile.email) {
    return done(null, false, {});
  }

  if (profile.email) {
    correo = profile.email;
  } else {
    if (profile.emails && profile.emails[0]) {
      correo = profile.emails[0];
    }
  }

  if (!correo) {
    return done(null, false, {});
  }

  Usuario.findOneByCorreo(correo)
    .then(usuario => {
      if (usuario) {
        return done(null, usuario.isConfirmado ? usuario : MessageService.messages.isntConfirmed, {});
      }

      let sexo;
      let apellidos;
      let primerApellido;
      let segundoApellido;

      sexo = profile.gender === "male" ? "M" : "F";
      apellidos = profile.last_name.split(" ");
      primerApellido = apellidos[0];

      if (apellidos.length > 1) {
        segundoApellido = apellidos[1];
      }

      Promise.all([
        Usuario_Facebook.create({id: profile.id}),
        Usuario.create({
          usuarioFacebookId: profile.id,
          correo: correo,
          primerNombre: profile.first_name,
          segundoNombre: profile.middle_name,
          primerApellido: primerApellido,
          segundoApellido: segundoApellido,
          sexo: sexo,
          fechaNacimiento: profile.birthday,
          isConfirmado: true
        })
      ])
        .then(dataUsuario => done(null, dataUsuario[1], {}))
        .catch(error => done(error, false, {}));


      /*.then(dataUsuario => done(null, dataUsuario, {}))
       .catch(error => done(error, false, {}));*/
    })
    .catch(error => done(error, false, {}));
  /*sails.log.info(profile);
   done(error, {data: "dato"}, {});*/
}

passport.serializeUser((usuario, done) => done(null, usuario));

passport.deserializeUser((usuario, done) => done(null, usuario));

passport.use(new JwtStrategy(JWT_STRATEGY_CONFIG, _onJwtStrategyAuth));
passport.use(new LocalStrategy(LOCAL_STRATEGY_CONFIG, _onLocalStrategyAuth));
passport.use(new FacebookStrategy(FACEBOOK_STRATEGY_CONFIG, _onFacebookStrategyAuth));

module.exports.jwtSettings = {
  expiresInDays: EXPIRES_IN_DAYS,
  secret: SECRET,
  algorithm: ALGORITHM,
  issuer: ISSUER,
  audience: AUDIENCE
};

module.exports.jwtSettingsAdmin = {
  expiresInDays: EXPIRES_IN_DAYS,
  secret: SECRET_ADMIN,
  algorithm: ALGORITHM,
  issuer: ISSUER,
  audience: AUDIENCE
};

module.exports.jwtSettingsConfirm = {
  expiresInDays: EXPIRES_IN_DAYS,
  secret: SECRET_CONFIRM,
  algorithm: ALGORITHM,
  issuer: ISSUER,
  audience: AUDIENCE
};
