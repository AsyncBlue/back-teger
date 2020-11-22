"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const autenticacion_1 = require("../middlewares/autenticacion");
const evento_model_1 = require("../models/evento.model");
const tejido_model_1 = require("../models/tejido.model");
const eventoRoutes = express_1.Router();
//Obtener Eventos Paginados
eventoRoutes.get('/', [autenticacion_1.verificaToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const usuario = req.usuario._id;
    /* let pagina = Number(req.query.pagina) || 1;
    let skip = pagina -1;
    skip = skip * 10; */
    const eventos = yield evento_model_1.Evento.find({ usuario: usuario, from: "movil" }).sort({ _id: -1 }) /* .skip(skip).limit(10) */.populate('usuario', '-password').exec();
    res.json({
        ok: true,
        /* pagina, */
        eventos,
        usuario
    });
}));
//Crear Evento
eventoRoutes.post('/', [autenticacion_1.verificaToken], (req, res) => {
    const body = req.body;
    body.usuario = req.usuario._id;
    body.from = "movil";
    evento_model_1.Evento.create(body).then((eventoDB) => __awaiter(void 0, void 0, void 0, function* () {
        yield eventoDB.populate('usuario', '-password').execPopulate();
        res.json({
            ok: true,
            evento: eventoDB
        });
    })).catch(err => {
        res.json(err);
    });
});
//Borrar Evento
eventoRoutes.post('/borrarEvento', [autenticacion_1.verificaToken], (req, res) => {
    const evento = req.body._id;
    evento_model_1.Evento.findOneAndRemove({ _id: evento }).then(eventoDB => {
        res.json({
            ok: true,
            evento: eventoDB
        });
    }).catch(err => {
        res.json(err);
    });
});
//Unirse a Evento
eventoRoutes.post('/unirseEvento', (req, res) => {
    const evento = req.body._id;
    evento_model_1.Evento.findById(evento).then(eventoDB => {
        res.json({
            ok: true,
            evento: eventoDB
        });
    }).catch(err => {
        res.json(err);
    });
});
/* WEB */
/* VER TEJIDO WEB*/
eventoRoutes.post('/vertejido', (req, res) => {
    const body = req.body;
    evento_model_1.Evento.findById(body.tejido).then(eventoDB => {
        res.json({
            ok: true,
            evento: eventoDB
        });
    }).catch(err => {
        res.json(err);
    });
});
/* CREAR EVENTO WEB */
eventoRoutes.post('/crearEventoWEB', [autenticacion_1.verificaToken], (req, res) => {
    const body = req.body;
    body.usuario = req.usuario._id;
    body.from = "web";
    body.maxEnlaces = req.body.maxEnlaces;
    evento_model_1.Evento.create(body).then((eventoDB) => __awaiter(void 0, void 0, void 0, function* () {
        yield eventoDB.populate('usuario', '-password').execPopulate();
        tejido_model_1.Tejido.create({ evento: eventoDB._id, activo: true, usuario: req.usuario._id, enlaces: false, maxEnlaces: body.maxEnlaces }).then(tejidoDB => {
            res.json({
                ok: true,
                tejido: tejidoDB
            });
        }).catch(err => {
            res.json(err);
        });
        res.json({
            ok: true,
            evento: eventoDB
        });
    })).catch(err => {
        res.json(err);
    });
});
//OBTENER EVENTOS WEB
eventoRoutes.get('/obtenerEventosWEB', [autenticacion_1.verificaToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const usuario = req.usuario._id;
    /* let pagina = Number(req.query.pagina) || 1;
    let skip = pagina -1;
    skip = skip * 10; */
    const eventos = yield evento_model_1.Evento.find({ usuario: usuario, from: "web" }).sort({ _id: -1 }) /* .skip(skip).limit(10) */.populate('usuario', '-password').exec();
    res.json({
        ok: true,
        /* pagina, */
        eventos,
        usuario
    });
}));
//BORRAR EVENTO WEB
eventoRoutes.post('/borrarEventoWEB', [autenticacion_1.verificaToken], (req, res) => {
    const evento = req.body._id;
    evento_model_1.Evento.findOneAndRemove({ _id: evento }).then(eventoDB => {
        tejido_model_1.Tejido.findOneAndRemove({ evento: evento }).then(tejidoDB => {
            res.json({
                ok: true,
                tejido: tejidoDB
            });
        }).catch(err => {
            res.json(err);
        });
        res.json({
            ok: true,
            evento: eventoDB
        });
    }).catch(err => {
        res.json(err);
    });
});
//ULTIMOS EVENTOS WEEB
eventoRoutes.get('/ultimosEventos', [autenticacion_1.verificaToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const usuario = req.usuario._id;
    /* let pagina = Number(req.query.pagina) || 1;
    let skip = pagina -1;
    skip = skip * 10; */
    const eventos = yield evento_model_1.Evento.find({ usuario: usuario, from: "web" }).sort({ _id: -1 }).limit(4).populate('usuario', '-password').exec();
    res.json({
        ok: true,
        /* pagina, */
        eventos,
        usuario
    });
}));
exports.default = eventoRoutes;
