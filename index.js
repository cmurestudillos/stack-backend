const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');
const chalk = require('chalk');

const app = express();

conectarDB();

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json({ extended: true }));

app.use('/api/usuarios', require('./routes/usuarios'));

// Para desarrollo local
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3001;
  app.listen(port, '0.0.0.0', () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`);
  });
}

// Exportar la aplicación para Vercel
module.exports = app;
