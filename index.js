#!/usr/bin/env node
import chalk from "chalk";
import * as fs from "node:fs";
import path from "node:path";
import { loadConfig, saveConfig } from "./src/configController.js";

const CONFIG_PATH = path.resolve("legacy", "vless-config", "users.json");

const action = process.argv[2];

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

if (!process.argv[3]) {
  console.error(chalk.white.bgRed(`Error: Отсутствует третий аргумент`));
  process.exit(1);
}

switch (action) {
  case "add":
    console.log(
      chalk.bgYellow(`Добавляю пользователя: ${process.argv[3]} ...`),
    );

    const config = loadConfig();

    for (let value of config.users) {
      if (value === process.argv[3]) {
        console.log(
          chalk.bgRed(`Такой пользователь ${process.argv[3]} уже есть!`),
        );
        process.exit(1);
      }
    }

    config.users.push(process.argv[3]);

    saveConfig(config);

    break;

  case "remove": {
    const config = loadConfig();
    console.log(chalk.bgYellow(`Удаляю пользователя: ${process.argv[3]} ...`));

    for (let value of config.users) {
      if (value === process.argv[3]) {
        const i = config.users.indexOf(value);
        config.users.splice(i, 1);
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

  default:
    console.log(
      chalk.white.bgRed(`Error: Неизвестный второй аргумент - ${action}`),
    );
    break;
}
