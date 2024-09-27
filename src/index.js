/* Importar módulos necesarios */
import fs from "fs";
import inquirer from "inquirer";
import Table from "cli-table3";
import UserService from "./services/userService.js";
import chalk from "chalk";
import { logInfo } from "./utils/logger.js";

const userService = new UserService();

/* Función para mostrar menu principal */
async function mainMenu() {
  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "Seleccione una opción:",
      choices: [
        { name: "Verificar legajo", value: "verify_singular" },
        { name: "Verificar legajos y permisos", value: "verify" },
        { name: "Salir", value: "exit" },
      ],
    },
  ]);

  switch (answers.action) {
    case "verify":
      await selectJsonFile();
      break;
    case "verify_singular":
      await singularUser();
      break;
    case "exit":
      logInfo("Saliendo...");
      process.exit();
  }

  // Función para seleccionar un archivo JSON
  async function selectJsonFile() {
    const { filePath } = await inquirer.prompt([
      {
        type: "list",
        name: "filePath",
        message: "Seleccione una lista de usuarios para verificar permisos:",
        choices: fs
          .readdirSync("./src/data")
          .map((file, index) => ({
            name: `${index + 1}. ${file}`,
            value: `./src/data/${file}`,
          })),
      },
    ]);
    const users = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const { appName } = await inquirer.prompt([
      {
        type: "list",
        name: "appName",
        message: "Seleccione la aplicación para verificar permisos:",
        choices: [
          { name: "VUS Peatonal", value: 1 },
          {
            name: "VUS Ratti",
            value: 10,
          },
          { name: "Habilitaciones", value: 12 },
        ],
      },
    ]);

    const appId = appName;
    await userService.verifyUsers(users, appId);
  }
  // Funciòn para buscar un usuario en particular
  async function singularUser() {
    const { legajo } = await inquirer.prompt([
      {
        type: "input",
        name: "legajo",
        message: "Ingrese el legajo del usuario:",
      },
    ]);
    const { password } = await inquirer.prompt([
      {
        type: "password",
        name: "password",
        message: "Ingrese la contraseña del usuario:",
      },
    ]);
    const response = await userService.checkUser(legajo, password);

    if (response && response.exists) {
      const table = new Table({
        head: [chalk.white.bold("Aplicación"), chalk.white.bold("Rol")],
        colWidths: [40, 20],
      });
      console.log("-".repeat(50));
      console.log(chalk.green.bold("Usuario encontrado!"));
      console.log(chalk.green.bold("Nombre: "), response.name);
      console.log("-".repeat(50));
      console.log(chalk.green.bold("Permisos: "));
      response.permissions.forEach((permission) => {
        table.push([
          permission.apps_name + " || " + permission.apps_description,
          permission.role,
        ]);
      });
      console.log(table.toString());
    } else {
      console.log("-".repeat(50));
      console.log(chalk.red.bold(`Legajo o contraseña incorrecta.`));
      console.log(
        chalk.red.bold(`El legajo ${legajo} es incorrecto o podría no existir.`)
      );
      console.log("-".repeat(50));
    }
  }
}
/* Ejecutar la verificación de usuarios */
mainMenu();
