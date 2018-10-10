const TYPES = {
  BAD_REQUEST: "badRequest",
  SERVER_ERROR: "serverError",
  OK: "ok",
  FORBIDDEN: "forbidden"
};

const MESSAGES = {
  credentialError: {
    id: 2,
    type: TYPES.BAD_REQUEST
  },

  serverError: {
    id: 3,
    type: TYPES.SERVER_ERROR
  },

  logoutMessage: {
    id: 4,
    type: TYPES.OK
  },

  invalidParams: {
    id: 5,
    type: TYPES.BAD_REQUEST
  },

  successCreate: {
    id: 6,
    type: TYPES.OK
  },

  needAuth: {
    id: 7,
    type: TYPES.FORBIDDEN
  },

  emailUserError: {
    id: 8,
    type: TYPES.SERVER_ERROR
  },

  oldToken: {
    id: 9,
    type: TYPES.BAD_REQUEST
  },

  invalidToken: {
    id: 10,
    type: TYPES.BAD_REQUEST
  },

  generalError: {
    id: 11,
    type: TYPES.SERVER_ERROR
  },

  invalidPassword: {
    id: 12,
    type: TYPES.BAD_REQUEST
  },

  invalidUser: {
    id: 13,
    type: TYPES.BAD_REQUEST
  },

  forbiddenResource: {
    id: 14,
    type: TYPES.FORBIDDEN
  },

  successUpdate: {
    id: 16,
    type: TYPES.OK
  },

  loginError: {
    id: 17,
    type: TYPES.SERVER_ERROR
  },

  userExists: {
    id: 18,
    type: TYPES.FORBIDDEN
  },

  errorCreateToken: {
    id: 19,
    type: TYPES.SERVER_ERROR
  },

  emailRecoveryError: {
    id: 20,
    type: TYPES.SERVER_ERROR
  },

  successRegister: {
    id: 21,
    type: TYPES.OK
  },

  isntConfirmed: {
    id: 22,
    type: TYPES.FORBIDDEN
  },

  correctVeterinary: {
    id: 23,
    type: TYPES.OK
  },

  successResend: {
    id: 24,
    type: TYPES.OK
  },

  userNotExists: {
    id: 25,
    type: TYPES.FORBIDDEN
  },

  forbiddenOwner: {
    id: 26,
    type: TYPES.FORBIDDEN
  },

  userWithoutPets: {
    id: 27,
    type: TYPES.OK
  },

  userWithoutQuestions: {
    id: 28,
    type: TYPES.OK
  },

  lockedQuestion: {
    id: 29,
    type: TYPES.FORBIDDEN
  },

  notNeedAuth: {
    id: 30,
    type: TYPES.FORBIDDEN
  },

  facebookPermissionError: {
    id: 31,
    type: TYPES.BAD_REQUEST
  }
};

function sendMessage(res, message) {
  switch (message.type) {
    case TYPES.SERVER_ERROR:
      res.serverError(message);
      break;
    case TYPES.FORBIDDEN:
      res.forbidden(message);
      break;
    case TYPES.BAD_REQUEST:
      res.badRequest(message);
      break;
    case TYPES.OK:
    default:
      res.ok(message);
  }
}

module.exports = {

  messages: MESSAGES,

  send: sendMessage,

  sendError: (res, err) => {
    sails.log.error(err);

    if (err.id) {
      return sendMessage(res, err);
    }

    sendMessage(res, err.invalidAttributes || (err.originalError && err.originalError.invalidAttributes) ? MessageService.messages.invalidParams : MessageService.messages.generalError);
  }

};
