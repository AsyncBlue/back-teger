import { Schema, Document, model } from 'mongoose';
import { Evento } from './evento.model';

const tejidoSchema = new Schema ({

    evento: {
        type: Schema.Types.ObjectId,
        ref: 'Evento',
        required: [ true, 'El evento es necesario']
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
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [ true, 'Debe de existir una referencia a un usuario' ]
    },
    enlaces: {
        type: Boolean
    },
    maxEnlaces: {
        type: Number,
        required: [ true, 'Debe de existir la cantidad maxima de enlaces' ]
    }
});

interface ITejido extends Document {
    evento: String;
    participantes: String[];
    votos: String[];
    activo: Boolean;
    usuario: String;
    enlaces: Boolean;
    maxEnlaces: Number;
}

export const Tejido = model<ITejido>('Tejido', tejidoSchema);