const { Router } = require('express')
const { validarJWT } = require('../middlewares/validar-jwt')
const { actualizarEvento, eliminarEvento, obtenerEvento, crearEvento } = require('../controllers/events')
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos')
const isDate = require('../helpers/isDate')
const router = Router()




router.get('/', [validarJWT], obtenerEvento)
router.post('/', [
        validarJWT,
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio obligatoria').custom( isDate ),
        check('end', 'Fecha de finalizacion obligatoria').custom( isDate ),
        validarCampos
    ], crearEvento)
router.put('/:id', [validarJWT], actualizarEvento)
router.delete('/:id', [validarJWT], eliminarEvento)


module.exports = router
