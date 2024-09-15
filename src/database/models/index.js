"use strict";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import UserModel from "./user.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configPath = path.join(__dirname, "../../config/database.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

const env = process.env.ENV || "development";

const sequelize = new Sequelize(
  process.env.DB_NAME || config[env].database,
  process.env.DB_USER || config[env].username,
  process.env.DB_PASSWORD || config[env].password || null,
  {
    host: process.env.DB_HOST || config[env].host,
    dialect: "mysql",
    logging: false,
  }
);

const User = UserModel(sequelize);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("DB Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

export { sequelize, User };
