import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  process.env.DB_NAME || "apptile-analytics-manager",
  process.env.DB_USER || "user",
  process.env.DB_PWD || "password",
  {
    host: process.env.DB_HOST || "host",
    dialect: "postgres",
    logging: false,
  }
);
