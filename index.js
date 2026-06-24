import express from 'express';
import cors from 'cors';
import conectarDB from './config/db.js';
import usuariosRouter from './routes/usuarios.js';

const app = express();

await conectarDB();

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: false,
};
app.use(cors(corsOptions));

app.use(express.json());

app.use('/api/usuarios', usuariosRouter);

// Para desarrollo local
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3001;
  app.listen(port, '0.0.0.0', () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`);
  });
}

// Exportar la aplicación para Vercel
export default app;
