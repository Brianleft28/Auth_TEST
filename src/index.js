/* Importar módulos necesarios */
import fs from "fs";
import chalk from "chalk";
import axios from "axios";
import config from "../config.js";

/* Leer archivo JSON */
const users = JSON.parse(fs.readFileSync("./src/data/users.json", "utf-8"));

console.log("Usuarios:", users);

/*  Url de la api y timeout desde la configuracion */
const apiUrl = config.api.url;
const timeout = config.timeout;

console.log(chalk.blue.bold(`API URL: ${apiUrl}`));
console.log("Timeout:", timeout);

/* Función para verificar si un usuario existe en la base de datos */
async function checkUserExists(legajo, password) {
  try {
    const response = await axios.post(
      `${apiUrl}`,
      {
        legajo: legajo,
        password: password,
      },
      {
        timeout: timeout,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200 && response.data && !response.data.error) {
      console.log("---------------------------------------");
      console.log(
        chalk.greenBright.bold(`Usuario encontrado: ${response.data.body.name}`)
      );

      return true;
    } else {
      console.log(`Respuesta inesperada: ${response.status}`);
      return false;
    }
  } catch (error) {
    if (error.response) {
      if (
        error.response.status === 401 &&
        error.response.data.body &&
        error.response.data.body.errors
      ) {
        const errorMsg = error.response.data.body.errors[0].msg;
        if (errorMsg === "Ususario o Clave incorrecta.") {
          console.log("---------------------------------------");
          console.log(chalk.red.bold(`Usuario o clave incorrecta: ${legajo}`));
          return false;
        }
      } else if (error.response.status === 404) {
        console.log("---------------------------------------");
        console.log(chalk.red.bold(`Usuario no encontrado: ${legajo} (404)`));
        console.log(error.response.data);
        return false;
      }
    } else if (error.code === "ENOTFOUND") {
      console.log(
        chalk.red.bold(
          `Error de conexión al verificar el usuario ${legajo}:`,
          error.message
        )
      );
      return null;
    } else {
      console.log(
        chalk.red.bold(
          `Error al verificar el usuario ${legajo}:`,
          error.message
        )
      );
      return null;
    }
  }
}

/* Función principal para verificar todos los usuarios */
async function verifyUsers(users) {
  for (const user of users) {
    const exists = await checkUserExists(user.legajo, user.password);
    if (exists === null) {
      console.log(
        chalk.red.bold(
          `No se pudo verificar el usuario ${user.legajo} debido a un error de conexión.`
        )
      );
    } else if (exists) {
      console.log(
        chalk.bold.green(
          `El usuario ${user.legajo} existe en la base de datos.`
        )
      );
    } else {
      console.log(
        chalk.red.bold(
          `El usuario ${user.legajo} no existe en la base de datos.`
        )
      );
    }
  }
}

/* Ejecutar la verificación de usuarios */
verifyUsers(users);
