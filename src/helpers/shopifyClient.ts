import Shopify from '@shopify/shopify-api';
import { IShopifyCustomerDetails } from '../types/types';


export class ShopifyClient {

  static extractIdFromShopifyId(shopifyId:string){
    return shopifyId.split('/').pop()
  }

  static async GetShopifyCustomer(shop: string, storefrontAccessToken: string, customerAccessToken: string): Promise<IShopifyCustomerDetails> {
    // Load the current session to get the `accessToken`
    // GraphQLClient takes in the shop url and the accessToken for that shop.
    const client = new Shopify.Clients.Storefront(shop, storefrontAccessToken);
    // Use client.query and pass your query as `data`

    const response: any = await client.query({
      data: {
        query: `query GetCustomer($customerAccessToken:  String!) {
            customer(customerAccessToken: $customerAccessToken) {
              id
              firstName
              lastName
              acceptsMarketing
              email
              phone
            }
          }`,
        variables: {
          customerAccessToken
        },
      },
    });

    const responseBody = response.body as any;

    if (responseBody?.errors) {
      throw responseBody?.errors[0];
    }

    if (!responseBody?.data?.customer) {
      throw new Error('Customer details can not be found!');
    }
    return responseBody?.data?.customer;
  }

}
