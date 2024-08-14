require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USER || "user",
    password: process.env.DB_PWD || "password",
    database: process.env.DB_NAME || "apptile-analytics-manager",
    host: process.env.DB_HOST || "host",
    port: "5432",
    dialect: "postgres",
    dialectOptions: {
      supportBigNumbers: true,
    },
  },
  production: {
    username: process.env.DB_USER || "user",
    password: process.env.DB_PWD || "password",
    database: process.env.DB_NAME || "apptile-analytics-manager",
    host: process.env.DB_HOST || "host",
    port: "5432",
    dialect: "postgres",
    dialectOptions: {
      supportBigNumbers: true,
    },
  },
};
