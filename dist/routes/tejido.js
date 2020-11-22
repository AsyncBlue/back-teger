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
const tejido_model_1 = require("../models/tejido.model");
const autenticacion_1 = require("../middlewares/autenticacion");
const tejidoRoutes = express_1.Router();
/* VER TEJIDO */
tejidoRoutes.post('/verTejido', (req, res) => {
    const body = req.body;
    body.evento = req.body.eventoID;
    tejido_model_1.Tejido.findOne({ evento: body.evento }).then(tejidoDB => {
        res.json({
            ok: true,
            tejido: tejidoDB
        });
    }).catch(err => {
        res.json(err);
    });
});
/* SUMAR PARTICIPANTE */
tejidoRoutes.post('/sumarParticipanteWEB', (req, res) => {
    const body = req.body;
    body.participantes = req.body.usuario;
    console.log(body);
    tejido_model_1.Tejido.findByIdAndUpdate(body.tejido, { "$addToSet": { "participantes": req.body.usuario } }, { new: true }, (err, tejidoDB) => {
        if (err)
            throw err;
        if (!tejidoDB) {
            return res.json({
                ok: false,
                mensaje: 'No existe un tejido con ese ID'
            });
        }
        res.json({
            ok: true,
            tejido: tejidoDB
        });
    });
});
/* VER TEJIDO WEB*/
tejidoRoutes.post('/recorrerTejido', (req, res) => {
    const body = req.body;
    tejido_model_1.Tejido.findById(body.tejido).then(tejidoDB => {
        res.json({
            ok: true,
            tejido: tejidoDB
        });
    }).catch(err => {
        res.json(err);
    });
});
//BORRAR PARTICIPANTE
tejidoRoutes.post('/borrarParticipante', (req, res) => {
    const body = req.body;
    body.participantes = req.body.usuario;
    tejido_model_1.Tejido.findByIdAndUpdate(body.tejido, { "$pull": { "participantes": req.body.usuario } }, { new: true }, (err, tejidoDB) => {
        if (err)
            throw err;
        if (!tejidoDB) {
            return res.json({
                ok: false,
                mensaje: 'No existe un tejido con ese ID'
            });
        }
        res.json({
            ok: true,
            tejido: tejidoDB
        });
    });
});
//GUARDAR VOTOS
tejidoRoutes.post('/guardarVotos', (req, res) => {
    const body = req.body;
    body.participantes = req.body.usuario;
    tejido_model_1.Tejido.findByIdAndUpdate(body.tejido, { "$addToSet": { "votos": req.body.votos } }, { new: true }, (err, tejidoDB) => {
        if (err)
            throw err;
        if (!tejidoDB) {
            return res.json({
                ok: false,
                mensaje: 'No existe un tejido con ese ID'
            });
        }
        res.json({
            ok: true,
            tejido: tejidoDB
        });
    });
});
/* CAMBAIR ESTADO */
tejidoRoutes.post('/cambiarEstado', (req, res) => {
    const body = req.body;
    tejido_model_1.Tejido.findByIdAndUpdate(body.tejido, { "activo": body.activo }, { new: true }, (err, tejidoDB) => {
        if (err)
            throw err;
        if (!tejidoDB) {
            return res.json({
                ok: false,
                mensaje: 'No existe un tejido con ese ID'
            });
        }
        res.json({
            ok: true,
            tejido: tejidoDB
        });
    });
});
/* INICIAR ENLACES*/
tejidoRoutes.post('/iniciarEnlaces', (req, res) => {
    const body = req.body;
    tejido_model_1.Tejido.findByIdAndUpdate(body.tejido, { "enlaces": body.enlaces }, { new: true }, (err, tejidoDB) => {
        if (err)
            throw err;
        if (!tejidoDB) {
            return res.json({
                ok: false,
                mensaje: 'No existe un tejido con ese ID'
            });
        }
        res.json({
            ok: true,
            tejido: tejidoDB
        });
    });
});
//VER TEJIDOSSSSSS
tejidoRoutes.get('/verTejidos', [autenticacion_1.verificaToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const usuario = req.usuario._id;
    const tejidos = tejido_model_1.Tejido.find().sort({ _id: -1 });
    var eventosFinal = [];
    (yield tejidos).forEach(element => {
        if (usuario != element.usuario) {
            element.participantes.forEach((resp) => {
                if (resp._id === usuario) {
                    eventosFinal.push(element.evento);
                }
            });
        }
    });
    res.json({
        ok: true,
        eventosFinal
    });
}));
//VER ULTIMOS 4
tejidoRoutes.get('/ultimosTejidos', [autenticacion_1.verificaToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const usuario = req.usuario._id;
    const tejidos = tejido_model_1.Tejido.find().sort({ _id: -1 }).limit(4);
    var eventosFinal = [];
    (yield tejidos).forEach(element => {
        if (usuario != element.usuario) {
            element.participantes.forEach((resp) => {
                if (resp._id === usuario) {
                    eventosFinal.push(element.evento);
                }
            });
        }
    });
    res.json({
        ok: true,
        eventosFinal
    });
}));
exports.default = tejidoRoutes;
