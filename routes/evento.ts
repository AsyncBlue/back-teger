import { Router, Response, Request } from "express";
import { verificaToken } from '../middlewares/autenticacion';
import { Evento } from '../models/evento.model';
import { Sobre } from '../models/sobre.model';
import { Tejido } from '../models/tejido.model';



const eventoRoutes = Router();

//Obtener Eventos Paginados
eventoRoutes.get('/', [verificaToken], async (req: any, res: Response) => {

    const usuario = req.usuario._id;

    /* let pagina = Number(req.query.pagina) || 1;
    let skip = pagina -1;
    skip = skip * 10; */

    const eventos = await Evento.find( { usuario: usuario, from: "movil" } ).sort({ _id: -1 })/* .skip(skip).limit(10) */.populate('usuario', '-password').exec();


    res.json({
        ok: true,
        /* pagina, */
        eventos,
        usuario
    });

});

//Crear Evento
eventoRoutes.post('/', [verificaToken], (req: any, res: Response) => {

    const body = req.body;
    body.usuario = req.usuario._id;
    body.from = "movil";

    Evento.create( body ).then( async eventoDB => {

        await eventoDB.populate('usuario', '-password').execPopulate();

        res.json({
            ok: true,
            evento: eventoDB
        });
    
    }).catch(  err =>{
        res.json(err)
    });

});



//Borrar Evento
eventoRoutes.post('/borrarEvento', [verificaToken], (req: any, res: Response) => {

    const evento = req.body._id;
    

    Evento.findOneAndRemove( {_id: evento} ).then(  eventoDB => {

        res.json({
            ok: true,
            evento: eventoDB
        });
    
    }).catch(  err =>{
        res.json(err)
    });

}); 


//Unirse a Evento

eventoRoutes.post('/unirseEvento', (req: any, res: Response) => {

    const evento = req.body._id;
    
    Evento.findById( evento ).then(  eventoDB => {

        res.json({
            ok: true,
            evento: eventoDB
        });
    
    }).catch(  err =>{
        res.json(err)
    });

}); 


/* WEB */

/* VER TEJIDO WEB*/
eventoRoutes.post('/vertejido', (req: any, res: Response) => {

    const body = req.body

    Evento.findById( body.tejido ).then( eventoDB => {

        res.json({
            ok: true,
            evento: eventoDB
        });

    }).catch( err => {
        res.json(err);
    })



});


/* CREAR EVENTO WEB */
eventoRoutes.post('/crearEventoWEB', [verificaToken], (req: any, res: Response) => {

    const body = req.body;
    body.usuario = req.usuario._id;
    body.from = "web";
    body.maxEnlaces = req.body.maxEnlaces


    Evento.create( body ).then( async eventoDB => {

        await eventoDB.populate('usuario', '-password').execPopulate();
        
        Tejido.create( {evento: eventoDB._id, activo: true, usuario: req.usuario._id, enlaces: false, maxEnlaces: body.maxEnlaces} ).then( tejidoDB => {


            res.json({
                ok: true,
                tejido: tejidoDB
            });
        
        }).catch(  err =>{
            res.json(err)
        });

        res.json({
            ok: true,
            evento: eventoDB
        });
    
    }).catch(  err =>{
        res.json(err)
    });



});

//OBTENER EVENTOS WEB
eventoRoutes.get('/obtenerEventosWEB', [verificaToken], async (req: any, res: Response) => {

    const usuario = req.usuario._id;

    /* let pagina = Number(req.query.pagina) || 1;
    let skip = pagina -1;
    skip = skip * 10; */

    const eventos = await Evento.find( { usuario: usuario, from: "web" } ).sort({ _id: -1 })/* .skip(skip).limit(10) */.populate('usuario', '-password').exec();


    res.json({
        ok: true,
        /* pagina, */
        eventos,
        usuario
    });

});


//BORRAR EVENTO WEB
eventoRoutes.post('/borrarEventoWEB', [verificaToken], (req: any, res: Response) => {

    const evento = req.body._id;
    
    Evento.findOneAndRemove( {_id: evento} ).then(  eventoDB => {

        Tejido.findOneAndRemove( { evento: evento } ).then( tejidoDB => {


            res.json({
                ok: true,
                tejido: tejidoDB
            });
        
        }).catch(  err =>{
            res.json(err)
        });

        res.json({
            ok: true,
            evento: eventoDB
        });
    
    }).catch(  err =>{
        res.json(err)
    });

}); 


//ULTIMOS EVENTOS WEEB
eventoRoutes.get('/ultimosEventos', [verificaToken], async (req: any, res: Response) => {

    const usuario = req.usuario._id;

    /* let pagina = Number(req.query.pagina) || 1;
    let skip = pagina -1;
    skip = skip * 10; */

    const eventos = await Evento.find( { usuario: usuario, from: "web" } ).sort({ _id: -1 }).limit(4).populate('usuario', '-password').exec();


    res.json({
        ok: true,
        /* pagina, */
        eventos,
        usuario
    });

});



export default eventoRoutes;