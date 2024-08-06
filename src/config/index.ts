import {config as defaults} from './lib';

export type NestedPartial<T> = {
  [K in keyof T]?: T[K] extends Array<infer R> ? Array<NestedPartial<R>> : NestedPartial<T[K]>;
};
export interface IApp {
  port: number;
  debug: boolean;
}
export interface IAppConfig {
  app: IApp;
  upstreams: {
    apptileServerEndpoint: string;
    integrationEndpoint: string;
  };
}

export const AppConfig: IAppConfig = defaults;
