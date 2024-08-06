import express from 'express';
import {apptileClient, shopifyClient} from '../helpers';
import {IShopifyCredentials} from '../types';
import {ResponseBuilder, logger} from '../apptile-common';

export async function shopifyAuthenticated(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const appId = req.headers['x-shopify-app-id'] as string;
    const customerAccessToken = req.headers['x-shopify-customer-access-token'] as string;

    if (!(appId && customerAccessToken)) {
      logger.debug(`authenticated appId or customerAccessToken missing`);
      res.status(401).json({message: 'Unauthorized!, appId or customerAccessToken missing'});
      return;
    }

    const shopifyCreds = (await apptileClient.getAppCredentials(
      appId,
      'shopify'
    )) as IShopifyCredentials;

    logger.info(`authenticated shopifyCreds fetched`,shopifyCreds);


    if (!shopifyCreds) {
      res.status(401).json({message: 'Unauthorized!, appId or customerAccessToken missing'});
      return;
    }

    const {id: shopifyCustomerGid} = await shopifyClient.GetShopifyCustomer(
      shopifyCreds.storeName,
      shopifyCreds.storefrontAccessToken,
      customerAccessToken
    );
    if (shopifyCustomerGid) {
      logger.info(`authenticated was successful`);
      next();
      return;
    }
    res.status(401).send();
    return;
  } catch (error) {
    logger.error(`shopifyAuth failed`, error);
    console.trace(error)
    ResponseBuilder.InternalServerError(res, error);
    return;
  }
}

