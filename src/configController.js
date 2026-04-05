import path from "path";
import { fileURLToPath } from "url";
import { existsSync, readFileSync, writeFileSync } from "fs";
import chalk from "chalk";
import { randomUUID } from "crypto";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url); // железобетонно знает где лежит этот файл
const __dirname = path.dirname(__filename);

// Теперь путь всегда будет считаться от папки src, где лежит этот файл
const CONFIG_PATH = path.resolve(
  __dirname,
  "..",
  "legacy",
  "vless-config",
  "config.json",
);

// читаем и возвращаем объект
export function loadConfig() {
  const defaultObject = {
    inbounds: [
      {
        port: 443,
        protocol: "vless",
        settings: {
          clients: [], // Вот сюда мы будем пушить наших пользователей
        },
      },
    ],
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
  // linux/systemd restart:
  try {
    execSync("systemctl restart xray", { encoding: "utf-8" });
  } catch (error) {
    console.log(
      chalk.yellow(
        `Предупреждение: не удалось перезапустить сервис (это нормально для Windows)`,
      ),
    );
  }

  console.log(chalk.bold.bgGreen(`Успешно записал`));
  return updatedData;
}

export function generateNewUser(name) {
  const newUser = {
    id: randomUUID(),
    email: name,
    alterId: 0,
  };
  return newUser;
}
