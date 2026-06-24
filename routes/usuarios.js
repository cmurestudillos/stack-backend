import express from 'express';
import { body } from 'express-validator';
import * as usuarioController from '../controllers/usuarioController.js';

const router = express.Router();

const usuarioValidators = [
  body('email').isEmail().withMessage('El email no es válido.'),
  body('first_name').notEmpty().withMessage('El nombre es obligatorio.'),
  body('last_name').notEmpty().withMessage('El apellido es obligatorio.'),
];

// Obtener todos los usuarios
router.get('/', usuarioController.getUsuarios);

// Proxy de avatares (debe ir antes de /:id para no ser capturada por ese parámetro)
router.get('/avatar', usuarioController.getAvatar);

// Obtener usuario por ID
router.get('/:id', usuarioController.getUsuariobyId);

// Crear un usuario
router.post('/', usuarioValidators, usuarioController.agregarUsuario);

// Actualizar usuario via ID
router.put('/:id', usuarioValidators, usuarioController.actualizarUsuario);

// Eliminar un usuario
router.delete('/:id', usuarioController.eliminarUsuarios);

export default router;
