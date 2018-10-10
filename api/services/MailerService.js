function sendEmail(nameTemplate, objData, to, subject) {
  return new Promise((resolve, reject) => {
    sails.hooks.email.send(nameTemplate, objData,
      {
        to: to,
        subject: subject
      },
      function (err) {
        if (err) {
          sails.log.error(err);
          reject(MessageService.messages.emailUserError);
        } else {
          resolve(MessageService.messages.successCreate);
        }
      }
    )
  });
}

module.exports = {

  sendRegister: obj => sendEmail("welcomeEmail",
    {
      username: obj.username,
      token: obj.token,
      address: obj.address,
      year: new Date().getFullYear()
    },
    obj.email, "Bienvenido a 3dog1"),

  sendRecoverPWD: obj => sendEmail("recoverEmail",
    {
      username: obj.username,
      token: obj.token,
      address: obj.address,
      year: new Date().getFullYear()
    },
    obj.email, "Recuperación de contraseña en 3dog1")

};
