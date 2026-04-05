#!/usr/bin/env node
import chalk from "chalk";
import {
  generateNewUser,
  loadConfig,
  saveConfig,
} from "./src/configController.js";
import { randomUUID } from "node:crypto";

const action = process.argv[2];

console.log(randomUUID());

if (!process.argv[2]) {
  console.error(chalk.white.bgRed(`Error: Отсутствует второй аргумент`));
  process.exit(1);
}

if (typeof action !== "string") {
  console.error(
    chalk.white.bgRed(
      `action должен быть string, а получил ${typeof action}: `,
    ),
  );
  process.exit(1);
}

switch (action) {
  case "add":
    if (!process.argv[3]) {
      console.error(chalk.white.bgRed(`Error: Отсутствует третий аргумент`));
      process.exit(1);
    }
    console.log(
      chalk.bgYellow(`Добавляю пользователя: ${process.argv[3]} ...`),
    );

    const config = loadConfig();

    for (let value of config.inbounds[0].settings.clients) {
      if (value.email === process.argv[3]) {
        console.log(
          chalk.bgRed(`Такой пользователь ${process.argv[3]} уже есть!`),
        );
        process.exit(1);
      }
    }

    const newUser = generateNewUser(process.argv[3]);

    config.inbounds[0].settings.clients.push(newUser);

    saveConfig(config);

    break;

  case "remove": {
    if (!process.argv[3]) {
      console.error(chalk.white.bgRed(`Error: Отсутствует третий аргумент`));
      process.exit(1);
    }
    const config = loadConfig();
    console.log(chalk.bgYellow(`Удаляю пользователя: ${process.argv[3]} ...`));

    for (let value of config.inbounds[0].settings.clients) {
      if (value.email === process.argv[3]) {
        const i = config.inbounds[0].settings.clients.indexOf(value);
        config.inbounds[0].settings.clients.splice(i, 1);
        saveConfig(config);
        console.log(
          chalk.bold.bgGreen(`Пользователь ${process.argv[3]} удален!`),
        );
        process.exit(0);
      }
    }
    console.log(chalk.bgRed(`Error: Пользователя ${process.argv[3]} нету`));

    break;
  }
  case "list": {
    const config = loadConfig();
    const tab = config.inbounds[0].settings.clients;
    console.log("Список пользователей");
    console.table(tab);
    break;
  }

  default:
    console.log(
      chalk.white.bgRed(`Error: Неизвестный второй аргумент - ${action}`),
    );
    break;
}
