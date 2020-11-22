import { Router, Response } from "express";
import { Tejido } from '../models/tejido.model';
import { verificaToken } from '../middlewares/autenticacion';
import { Evento } from '../models/evento.model';

const tejidoRoutes = Router();


/* VER TEJIDO */
tejidoRoutes.post('/verTejido', (req: any, res: Response) => {

    const body = req.body
    body.evento = req.body.eventoID

    Tejido.findOne( {evento: body.evento} ).then( tejidoDB => {

        res.json({
            ok: true,
            tejido: tejidoDB
        });

    }).catch( err => {
        res.json(err);
    })



});



/* SUMAR PARTICIPANTE */
tejidoRoutes.post('/sumarParticipanteWEB', (req: any, res: Response) => {

    const body = req.body;
    body.participantes = req.body.usuario;
    console.log(body);

    Tejido.findByIdAndUpdate( body.tejido, { "$addToSet": { "participantes": req.body.usuario} }, { new: true }, (err, tejidoDB) =>{

        if ( err ) throw err;

        if ( !tejidoDB ) {
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
tejidoRoutes.post('/recorrerTejido', (req: any, res: Response) => {

    const body = req.body

    Tejido.findById( body.tejido ).then( tejidoDB => {

        res.json({
            ok: true,
            tejido: tejidoDB
        });

    }).catch( err => {
        res.json(err);
    })



});

//BORRAR PARTICIPANTE
tejidoRoutes.post('/borrarParticipante', (req: any, res: Response) => {

    const body = req.body;
    body.participantes = req.body.usuario;
    
    Tejido.findByIdAndUpdate( body.tejido, { "$pull": { "participantes": req.body.usuario} }, { new: true }, (err, tejidoDB) =>{

        if ( err ) throw err;

        if ( !tejidoDB ) {
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
tejidoRoutes.post('/guardarVotos', (req: any, res: Response) => {

    const body = req.body;
    body.participantes = req.body.usuario;
    
    Tejido.findByIdAndUpdate( body.tejido, { "$addToSet": { "votos": req.body.votos } }, { new: true }, (err, tejidoDB) =>{

        if ( err ) throw err;

        if ( !tejidoDB ) {
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
tejidoRoutes.post('/cambiarEstado', (req: any, res: Response) => {

    const body = req.body;
   

    Tejido.findByIdAndUpdate( body.tejido, { "activo": body.activo}, { new: true }, (err, tejidoDB) =>{

        if ( err ) throw err;

        if ( !tejidoDB ) {
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
tejidoRoutes.post('/iniciarEnlaces', (req: any, res: Response) => {

    const body = req.body;
   

    Tejido.findByIdAndUpdate( body.tejido, { "enlaces": body.enlaces}, { new: true }, (err, tejidoDB) =>{

        if ( err ) throw err;

        if ( !tejidoDB ) {
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
tejidoRoutes.get('/verTejidos', [verificaToken], async (req: any, res: Response) => {

    const usuario = req.usuario._id;

    const tejidos = Tejido.find().sort({ _id: -1 });

    var eventosFinal: String[] = [];

    (await tejidos).forEach( element => {

        if (usuario != element.usuario) {

            
            element.participantes.forEach( (resp: any) => {

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

});


//VER ULTIMOS 4
tejidoRoutes.get('/ultimosTejidos', [verificaToken], async (req: any, res: Response) => {

    const usuario = req.usuario._id;

    const tejidos = Tejido.find().sort({ _id: -1 }).limit(4);

    var eventosFinal: String[] = [];

    (await tejidos).forEach( element => {

        if (usuario != element.usuario) {

            
            element.participantes.forEach( (resp: any) => {

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

});


export default tejidoRoutes;