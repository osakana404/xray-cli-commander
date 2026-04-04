import path from "path";
import { fileURLToPath } from "url";
import { existsSync, readFileSync, writeFileSync } from "fs";
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url); // железобетонно знает где лежит этот файл
const __dirname = path.dirname(__filename);

// Теперь путь всегда будет считаться от папки src, где лежит этот файл
const CONFIG_PATH = path.resolve(
  __dirname,
  "..",
  "legacy",
  "vless-config",
  "users.json",
);

// читаем и возвращаем объект
export function loadConfig() {
  const defaultObject = {
    users: [],
  };

  if (existsSync(CONFIG_PATH)) {
    try {
      const data = readFileSync(CONFIG_PATH, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.log(chalk.white.bgRed(`Файл кажется битый!`, error.message));
      return defaultObject;
    }
  } else {
    return defaultObject;
  }
}

// объект в строку и запись
export function saveConfig(config) {
  const updatedData = JSON.stringify(config, null, 2);
  writeFileSync(CONFIG_PATH, updatedData);
  console.log(chalk.bold.bgGreen(`Успешно записал`));
  return updatedData;
}
