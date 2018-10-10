/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#!/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.policies.html
 */


module.exports.policies = {

  /***************************************************************************
   *                                                                          *
   * Default policy for all controllers and actions (`true` allows public     *
   * access)                                                                  *
   *                                                                          *
   ***************************************************************************/

  /*'find': true,
   'create': true,
   'update': true,
   'destroy': false,
   'findOne': false*/

  '*': false,

  RoutesController: {
    "*": "sessionAuthView",
    login: "notSessionAuthView",
    register: "notSessionAuthView",
    confirm: "notSessionAuthView",
    detallePregunta: true
  },

  MascotaController: {
    find: ["sessionAuth", "filterByOwner"],
    create: ["sessionAuth", "filterCreate"],
    update: ["sessionAuth", "isPetOwner"],
    findOne: ["sessionAuth", "isPetOwner"],
    misMascotas: "sessionAuth",
  },

  Tipo_MascotaController: {
    find: true,
    findOne: true
  },

  Tipo_DocController: {
    find: true,
    findOne: true
  },

  RazaController: {
    find: true,
    findOne: true
  },

  PreguntaController: {
    find: true,
    findOne: true,
    misPreguntas: "sessionAuth",
    create: ["sessionAuth", "filterCreate"],
    update: ["sessionAuth", "isQuestionOwner", "questionNotHasAnswers"]
  },

  RespuestaController: {
    findOne: true,
    create: ["sessionAuth", "filterCreate", "isVeterinario"]
  },

  VeterinarioController: {
    create: ["sessionAuth", "filterCreate"],
    destroy: ["sessionAuth", "filterCreate"]
  },

  UsuarioController: {
    serVeterinario: "sessionAuth"
  },

  TokenController: {
    "*": true
  },

  AuthController: {
    "*": true,
    logout: "sessionAuth",
    changePwd: "sessionAuth",
    prueba: "sessionAuth"
  }

  /***************************************************************************
   *                                                                          *
   * Here's an example of mapping some policies to run before a controller    *
   * and its actions                                                          *
   *                                                                          *
   ***************************************************************************/
  // RabbitController: {

  // Apply the `false` policy as the default for all of RabbitController's actions
  // (`false` prevents all access, which ensures that nothing bad happens to our rabbits)
  // '*': false,

  // For the action `nurture`, apply the 'isRabbitMother' policy
  // (this overrides `false` above)
  // nurture	: 'isRabbitMother',

  // Apply the `isNiceToAnimals` AND `hasRabbitFood` policies
  // before letting any users feed our rabbits
  // feed : ['isNiceToAnimals', 'hasRabbitFood']
  // }
};
