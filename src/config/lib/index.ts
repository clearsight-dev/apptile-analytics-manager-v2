import process from 'process';
import { IAppConfig } from "..";
import dotenv from "dotenv";
dotenv.config();

export const config: IAppConfig = {
  app: {
    port:
      (process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT) : null) ||
      3012,
    debug: true,
  },
  db: {
    main: {
      host: process.env.DB_HOST || "host",
      user: process.env.DB_USER || "user",
      password: process.env.DB_PWD || "password",
      database: process.env.DB_NAME || "apptile-analytics-manager",
      charset: "utf8",
    },
  },
  upstreams: {
    apptileServerEndpoint:
      process.env.APPTILE_SERVER_ENDPOINT || "http://apptile-server:3000",
  },
};
