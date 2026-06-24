import 'dotenv/config';
import axios from 'axios';
import { validationResult } from 'express-validator';

const REQRES_API = 'https://reqres.in/api/users';

// reqres.in exige desde 2024 una x-api-key (gratuita en https://app.reqres.in) para todos sus endpoints.
const reqresHeaders = () =>
  process.env.REQRES_API_KEY ? { headers: { 'x-api-key': process.env.REQRES_API_KEY } } : {};

// Listado de todos los usuarios
export const getUsuarios = async (req, res) => {
  try {
    const response = await axios.get(REQRES_API, reqresHeaders());
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Ha ocurrido un error al intentar obtener los datos.' });
  }
};

// Proxy de avatares: reqres.in sirve sus imágenes con `Cross-Origin-Resource-Policy: same-origin`
// (y sin `Access-Control-Allow-Origin`), por lo que el navegador bloquea cargarlas directamente
// desde el frontend. Las servimos desde nuestro propio origen para evitar ese bloqueo.
export const getAvatar = async (req, res) => {
  const { url } = req.query;

  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch {
    return res.status(400).json({ msg: 'URL de avatar no válida.' });
  }

  if (parsedUrl.hostname !== 'reqres.in') {
    return res.status(400).json({ msg: 'URL de avatar no válida.' });
  }

  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    res.set('Content-Type', response.headers['content-type'] ?? 'image/jpeg');
    res.set('Cache-Control', 'public, max-age=86400');
    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.status(502).json({ msg: 'No se ha podido obtener el avatar.' });
  }
};

// Obtener datos del usuario por ID
export const getUsuariobyId = async (req, res) => {
  try {
    const usuarioId = req.params.id;
    const response = await axios.get(`${REQRES_API}/${usuarioId}`, reqresHeaders());
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Ha ocurrido un error al obtener los datos del registro.' });
  }
};

// Añadir nuevo usuario
export const agregarUsuario = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    const payload = {
      email: req.body.email,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      avatar: req.body.avatar,
    };

    const response = await axios.post(REQRES_API, payload, reqresHeaders());
    res.status(201).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Ha ocurrido un error al intentar crear el usuario.' });
  }
};

// Modificar usuario
export const actualizarUsuario = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    const payload = {
      email: req.body.email,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      avatar: req.body.avatar,
    };

    const usuarioId = req.params.id;
    const response = await axios.put(`${REQRES_API}/${usuarioId}`, payload, reqresHeaders());
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Ha ocurrido un error al intentar modificar el usuario.' });
  }
};

// Eliminar usuario
export const eliminarUsuarios = async (req, res) => {
  try {
    const usuarioId = req.params.id;

    if (!usuarioId) {
      return res.status(404).json({ msg: 'Usuario no encontrado.' });
    }

    await axios.delete(`${REQRES_API}/${usuarioId}`, reqresHeaders());
    res.json({ msg: 'Usuario eliminado.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error en el servidor.' });
  }
};
