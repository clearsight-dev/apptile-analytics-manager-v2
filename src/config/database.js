require("dotenv").config();

module.exports = {
  development: {
    username: process.env.AWM_ANALYTICS_DB_USER || "user",
    password: process.env.AWM_ANALYTICS_DB_PWD || "password",
    database: process.env.AWM_ANALYTICS_DB_NAME || "apptile-analytics-manager",
    host: process.env.AWM_ANALYTICS_DB_HOST || "host",
    port: "5432",
    dialect: "postgres",
    dialectOptions: {
      supportBigNumbers: true,
    },
  },
  production: {
    username: process.env.AWM_ANALYTICS_DB_USER || "user",
    password: process.env.AWM_ANALYTICS_DB_PWD || "password",
    database: process.env.AWM_ANALYTICS_DB_NAME || "apptile-analytics-manager",
    host: process.env.AWM_ANALYTICS_DB_HOST || "host",
    port: "5432",
    dialect: "postgres",
    dialectOptions: {
      supportBigNumbers: true,
    },
  },
};
