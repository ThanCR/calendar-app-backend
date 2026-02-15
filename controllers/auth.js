const { response } = require('express')
const bcrypt = require('bcryptjs')
const Usuario = require('../models/Usuario')
const {generarJWT} = require('../helpers/jwt')

const crearUsuario = async (req, res = response) => {

    const { email, password } = req.body

    console.log(email, password)
    try {
        let usuario = await Usuario.findOne({ email })

        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Hay un usuario ya existente que coincide con el correo electronico suministrado',
            })
        }

        usuario = new Usuario(req.body)

        const salt = bcrypt.genSaltSync()
        usuario.password = bcrypt.hashSync(password, salt)

        await usuario.save()

        const token = await generarJWT( usuario._id, usuario.name)

        return res.status(201).json({
            ok: true,
            msg: 'Usuario registrado correctamente',
            _id: usuario._id,
            name: usuario.name,
            token
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error al intentar crear el usuario, por favor contacte al servicio de soporte'
        })
    }

}

const loginUsuario = async (req, res) => {
    const { email, password } = req.body
    try {
        let usuario = await Usuario.findOne({ email })

        if (!usuario) {
            return res.status(400).json({
                ok: true,
                msg: 'Las credenciales no son validas o el usuario no existe',
            })
        }
        const validarPassword = bcrypt.compareSync(password, usuario.password)
        if (!validarPassword) {
            return res.status(400).json({
                ok: true,
                msg: 'Credenciales incorrectas',
            })
        }
        const token = await generarJWT( usuario._id, usuario.name)
        return res.status(200).json({
            ok: true,
            _id: usuario._id,
            email: usuario.email,
            name: usuario.name,
            token
        })
    } catch (error) {
        console.log(error)
        res.json({
            ok: true,
            msg: 'login de usuario',
            email,
            password,
        })
    }
}

const revalidarToken = async (req, res) => {
    const {uid, name} = req
    const token = await generarJWT( uid, name)
    res.json({
        ok: true,
        msg: 'revalidacion de token',
        token,
        uid,
        name
    })
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken,
}