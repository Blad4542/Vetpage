function isInteger(number) {
  return !isNaN(number) && number % 1 == 0;
}

function isValidParam(param) {
  return param !== null && param !== undefined && param.toString().trim();
}

module.exports = {

  isValidEmail: email => /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(email),

  isInteger: number => isInteger(number),

  isPositiveInteger: number => isInteger(number) && number > 0,

  isValidDate: (day, month, year) => !isNaN(Date.parse(`${year}-${month}-${day}`)),

  intToString: (num, digits) => num.toLocaleString('en-US', {minimumIntegerDigits: digits, useGrouping: false}),

  isValidPassword: password => /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(password), // at least one number, one lowercase and one uppercase letter
  // at least eight characters

  isValidToken: (token, type) => {
    if (!token) {
      return Promise.reject(MessageService.messages.invalidToken);
    }

    return Token.findOne({
      token: token,
      tokenType: type
    })
      .then(result => {

        if (!result) {
          return Promise.reject(MessageService.messages.invalidToken);
        }

        return TokenService.verifyToken(token);
      })
      .then(result => Promise.resolve(result))
      .catch(err => Promise.reject(err));
  },

  sendConfirmationEmail: (username, email, token) => MailerService.sendRegister(
    {
      username: username,
      email: email,
      token: token,
      address: `${UtilsServerService.getProtocol}://${UtilsServerService.getHost}:${UtilsServerService.getPortClient}`
    })
    .then(result => Promise.resolve(result))
    .catch(err => {
      sails.log.error(err);
      return Promise.resolve(err);
    }),

  verificateParams: params => {
    let data;

    data = Object.keys(params);

    for (let param of data) {
      if (!isValidParam(params[param])) {
        delete params[param];
      }
    }
  },

  isValidParam: param => isValidParam(param),

  getHost: sails.config.hostAddress,

  getProtocol: sails.config.ssl && sails.config.ssl.key && sails.config.ssl.cert ? 'https' : 'http',

  getPort: sails.config.proxyPort || sails.config.port,

  getPortClient: sails.config.portClient

}
