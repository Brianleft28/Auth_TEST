import axios from "axios";
import Table from "cli-table3";
import config from "../../config.js";
import { logError, logInfo, logSuccess, logWhite } from "../utils/logger.js";
import chalk from "chalk";

const apiUrl = config.api.url;
const timeout = config.timeout;

class UserService {
  /* Funcion para borrar un usuario */
  /* Función para verificar un usuario */
  async checkUser(legajo, password) {
    try {
      const response = await axios.post(
        apiUrl,
        { legajo, password },
        { timeout }
      );
      if (!response.data.error) {
        return {
          exists: true,
          name: response.data.body.name,
          permissions: response.data.body.permissions,
        };
      } else {
        return { exists: false, name: "N/A", permissions: [] };
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
            return {
              exists: false,
              name: "Ususario o Clave incorrecta.",
              permissions: [],
            };
          }
        } else if (error.response.status === 404) {
          return { exists: false, name: "N/A", permissions: [] };
        }
      } else if (error.code === "ENOTFOUND") {
        return { exists: null, name: "N/A" };
      } else {
        return { exists: null, name: "N/A", permissions: [] };
      }
    }
  }

  /* Función para verificar permisos de un usuario */
  checkPermissions(permissions, appId) {
    return permissions.some((permission) => permission.apps_id === appId);
  }

  /* Función para verificar multiples usuarios */
  async verifyUsers(users, appId) {
    console.log(chalk.blue.bold(" Verificando usuarios..."));

    const table = new Table({
      head: [
        chalk.white.bold("N°"),
        chalk.white.bold("Legajo°"),
        chalk.white.bold("Nombre"),
        chalk.white.bold("Existe"),
        chalk.white.bold("Permisos"),
      ],
      colWidths: [10, 10, 30, 10, 10],
    });

    let foundCount = 0;
    let incorrectCount = 0;
    let errorCount = 0;
    let nro = 1;

    for (const user of users) {
      const result = await this.checkUser(user.legajo, user.password);
      const hasPermission = this.checkPermissions(result.permissions, appId);
      if (result) {
        const existsText =
          result.exists === null
            ? "Error"
            : result.exists
            ? chalk.green.bold("Si")
            : chalk.red.bold("No");
        const permissionText = hasPermission
          ? chalk.green.bold("Sí")
          : chalk.red.bold("No");
        table.push([
          chalk.whiteBright(nro),
          chalk.whiteBright(user.legajo),
          result.name === "Ususario o Clave incorrecta."
            ? chalk.red.bold(result.name)
            : chalk.whiteBright.bold(result.name),
          existsText,
          permissionText,
        ]);
      } else {
        table.push([
          chalk.whiteBright.bold(nro),
          user.legajo,
          "Error",
          "Error",
          "Error",
        ]);
      }
      nro++; // Incrementa el contador
      if (result) {
        if (result.exists === true) {
          foundCount++;
        } else if (result.exists === false) {
          incorrectCount++;
        } else {
          errorCount++;
        }
      }
    }

    console.log(table.toString());
    console.log(" ");
    console.log("-".repeat(50));
    console.log(" ---- ", chalk.green.bold("Verificación completa."));
    console.log("-".repeat(50));
    console.log(` ---- Total de usuarios: ${chalk.blue.bold(users.length)}`);
    console.log(` ---- Usuarios encontrados: ${chalk.green.bold(foundCount)}`);
    console.log(
      ` ---- Usuarios incorrectos/no-existentes: ${chalk.red.bold(
        incorrectCount
      )}`
    );
    console.log(` ---- Errores de conexión: ${chalk.red.bold(errorCount)}`);
    console.log("-".repeat(50));
    console.log("-".repeat(50));
  }
}

export default UserService;
