import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  process.env.ANALYTICS_DB_NAME || "apptile-analytics-manager",
  process.env.ANALYTICS_DB_USER || "user",
  process.env.ANALYTICS_DB_PWD || "password",
  {
    host: process.env.ANALYTICS_DB_HOST || "host",
    dialect: "postgres",
    logging: false,
  }
);
