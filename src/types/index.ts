export interface IShopifyCredentials {
  storeName: string;
  shopifyShopId: string;
  offlineAccessToken: string;
  storefrontAccessToken: string;
}

export interface IIntegrationCredentials {
  accessToken: string;
}

export type IAppCredentials = IShopifyCredentials | IIntegrationCredentials;

export interface IShopifyCustomerDetails {
  id: string;
  firstName: string;
  lastName: string;
  acceptsMarketing: string;
  email: string;
  phone: number;
}

export class CustomHttpRequestError extends Error {
  code: number;
  constructor(code: number, message: string) {
    super(message);
    this.code = code;

    Object.setPrototypeOf(this, CustomHttpRequestError.prototype);
  }
}
