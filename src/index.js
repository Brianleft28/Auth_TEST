/* Importar módulos necesarios */
import fs from 'fs';
import axios from 'axios';
import config from '../config.js';

/* Leer archivo JSON */
const users = JSON.parse(fs.readFileSync('./src/data/users.json', 'utf-8'));

console.log('Usuarios:', users);

/*  Url de la api y timeout desde la configuracion */
const apiUrl = config.api.url;
const timeout = config.timeout;

console.log('API URL:', apiUrl);
console.log('Timeout:', timeout);

/* Función para verificar si un usuario existe en la base de datos */
async function checkUserExists(legajo) {
    try {
      const response = await axios.get(`${apiUrl}/${legajo}`, { timeout });
      console.log(`Respuesta de la API para ${legajo}:`, response.status);
      return response.status === 200;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log(`Usuario ${legajo} no encontrado (404).`);
        return false;
      } else if (error.code === 'ENOTFOUND') {
        console.error(`Error de conexión al verificar el usuario ${legajo}:`, error.message);
        return null;
      } else {
        console.error(`Error al verificar el usuario ${legajo}:`, error.message);
        return null;
      }
    }
  }
  
  /* Función principal para verificar todos los usuarios */
  async function verifyUsers(users) {
    for (const user of users) {
      const exists = await checkUserExists(user.legajo);
      if (exists === null) {
        console.log(`No se pudo verificar el usuario ${user.legajo} debido a un error de conexión.`);
      } else if (exists) {
        console.log(`El usuario ${user.legajo} existe en la base de datos.`);
      } else {
        console.log(`El usuario ${user.legajo} no existe en la base de datos.`);
      }
    }
  }
  
/* Ejecutar la verificación de usuarios */
verifyUsers(users);