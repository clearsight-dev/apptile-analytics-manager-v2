import process from 'process';
import {IAppConfig} from '../index';
import dotenv from 'dotenv';
dotenv.config();

export const config: IAppConfig = {
  app: {
    port: (process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT) : null) || 3012,
    debug: true
  },
  upstreams: {
    apptileServerEndpoint: process.env.APPTILE_SERVER_ENDPOINT || 'http://apptile-server:3000',
    integrationEndpoint: process.env.INTEGRATION_ENDPOINT || 'https://api.integration.com',
  }
};
