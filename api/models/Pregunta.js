var queryQuestionsUser;
var slug;

queryQuestionsUser = "SELECT p.* FROM pregunta AS p LEFT JOIN mascota AS m ON p.mascotaId = m.id WHERE m.usuarioId = ?";
slug = require('slug');

/**
 * Pregunta.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
module.exports = {
  connection: 'someMongodbServer',
  attributes: {
    descripcion: {
      type: "string",
      size: 16777215,
      required: true
    },

    titulo: {
      type: "string",
      size: 20,
      required: true,
      minLength: 5
    },

    mascotaId: {
      model: 'mascota',
      required: true
    },

    respuesta: {
      collection: 'respuesta',
      via: 'preguntaId'
    },

    slug: {
      type: "string",
      size: 30,
      required: true,
      minLength: 2
    }
  },

  getUserQuestions: (options, cb) => {
    Pregunta.query(queryQuestionsUser, [options.usuarioId], (err, preguntas) => {
      if (err) {
        return cb(err);
      }

      cb(null, preguntas);
    });
  },

  checkOwner: (options, cb) => {
    Pregunta.query(queryQuestionsUser + " AND p.id = ?", [options.usuarioId, options.id], (err, preguntas) => {
      if (err) {
        return cb(err);
      }

      cb(null, preguntas.length === 1);
    });
  },

  hasAnswers: (options, cb) => {
    Pregunta.findOne(options.id).populate("respuesta")
      .then(pregunta => cb(null, pregunta && pregunta.respuesta.length > 0))
      .catch(cb);
  },

  beforeValidate: (values, cb) => {
    if (values.titulo) {
      values.slug = slug(values.titulo).toLowerCase();
    }

    cb();
  }
};
