/**
 * RoutesController
 *
 * @description :: Server-side logic for managing routes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  login: (req, res) => res.view("login"),

  register: (req, res) => res.view("register"),

  confirm: (req, res) => res.view("confirm"),

  ingresarMascota: (req, res) => res.view("ingresarMascota"),

  hacerPregunta: (req, res) => res.view("hacerPregunta"),

  verMisPreguntas: (req, res) => res.view("verMisPreguntas"),

  serVeterinario: (req, res) => res.view("serVeterinario"),

  verPreguntas: (req, res) => res.view("verPreguntas"),

  homepage: (req, res) => Pregunta.find().sort('createdAt DESC').then(preguntas => res.view("homepage", {preguntas: preguntas})).catch(err => res.serverError()),

  detallePregunta: (req, res) => {
    let template;

    template = req.param("template");

    Pregunta.findOne(req.param("id")).populate("respuesta")
      .then(pregunta => {
        if (template === "amp") {
          return res.view("detallePreguntaAmp", {
            pregunta: pregunta,
            ampRoute: `/pregunta/${pregunta.id}/html/${pregunta.slug}`,
            layout: "layoutAmp"
          });
        }

        res.view("detallePregunta", {
          pregunta: pregunta,
          ampRoute: `/pregunta/${pregunta.id}/amp/${pregunta.slug}`
        });
      })
      .catch(err => MessageService.sendError(res, err))
  }
};
