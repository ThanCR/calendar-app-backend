const { response } = require('express')
const Evento = require('../models/Evento')


const obtenerEvento = async ( req, res = response ) => {
    const eventos = await Evento.find({})
                                .populate('user', 'name')
    res.status(200).json({
        ok: true,
        eventos
    })
}

const crearEvento = async (req, res = response ) => {
    const event = new Evento(req.body)

    try {
        
        event.user = req.uid
        const newEventDB = await event.save()

        res.status(201).json({
            ok: true,
            msg:"Evento creado",
            newEventDB
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            ok: false,
            msg: 'Hubo un error al crear el evento, por favor contacte al servicio de soporte'
        })
    }
}

const actualizarEvento = async(req, res = response ) => {

    const eventoId = req.params.id

    try {
        
        const evento = await Evento.findById(eventoId)
        const uid = req.uid

        if(!evento){
            res.status(404).json({
                ok: false,
                msg: 'No existe el evento'
            })
        }

        if(evento.user.toString() !== uid){
            return res.status(401).json({
                ok:false,
                msg: 'Acceso denegado'
            })
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, {new: true})

        res.json({
            ok: true,
            evento: eventoActualizado
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok:false,
            msg: 'Contacte a soporte'
        })
    }
}

const eliminarEvento = async(req, res = response) => {
    const eventoId = req.params.id
    const uid = req.uid
    try {
        const evento = await Evento.findById(eventoId)
        if(!evento){
            res.status(404).json({
                ok: false,
                msg: 'No existe el evento'
            })
        }
        if(evento.user.toString() !== uid){
            return res.status(401).json({
                ok:false,
                msg: 'Acceso denegado'
            })
        }
         await Evento.findByIdAndDelete(eventoId)
        res.json({
            ok: true,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok:false,
            msg: 'Contacte a soporte'
        })
    }
}

module.exports = {
    obtenerEvento,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}