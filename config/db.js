import mongoose from 'mongoose';
import chalk from 'chalk';

const conectarDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.log(chalk.yellow('MONGO_URI no definida: la API seguirá usando https://reqres.in/ como fuente de datos.'));
    return;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log(chalk.blue('Conexión a BBDD establecida.'));
  } catch (error) {
    console.log(chalk.red('Ha ocurrido un error al conectar a la base de datos.'));
    console.log(error);
    process.exit(1);
  }
};

export default conectarDB;
