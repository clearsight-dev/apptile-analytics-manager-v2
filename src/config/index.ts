import {config as defaults} from './lib';

export type NestedPartial<T> = {
  [K in keyof T]?: T[K] extends Array<infer R> ? Array<NestedPartial<R>> : NestedPartial<T[K]>;
};
export interface IApp {
  port: number;
  debug: boolean;
}

export interface IMain {
  host: string;
  user: string;
  password: string;
  database: string;
  charset: string;
}
export interface IDb {
  main: IMain;
}
export interface IAppConfig {
  app: IApp;
  db: IDb;
  upstreams: {
    apptileServerEndpoint: string;
  };
}

export const AppConfig: IAppConfig = defaults;
