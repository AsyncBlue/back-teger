"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const tejidoSchema = new mongoose_1.Schema({
    evento: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Evento',
        required: [true, 'El evento es necesario']
    },
    participantes: {
        type: Array,
        ref: 'Usuario'
    },
    votos: {
        type: Array
    },
    activo: {
        type: Boolean
    },
    usuario: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Debe de existir una referencia a un usuario']
    },
    enlaces: {
        type: Boolean
    },
    maxEnlaces: {
        type: Number,
        required: [true, 'Debe de existir la cantidad maxima de enlaces']
    }
});
exports.Tejido = mongoose_1.model('Tejido', tejidoSchema);
