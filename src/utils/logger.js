import chalk from "chalk";

export function logInfo(msg) {
  console.log(chalk.red.bold(msg));
}

export function logError(msg) {
  console.log(chalk.red.bold(msg));
}

export function logSuccess(msg) {
  console.log(chalk.green.bold(msg));
}

export function logWhite(msg) {
  console.log(chalk.whiteBright.bold(msg));
}
