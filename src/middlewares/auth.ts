import express from 'express';
import { apptileClient } from "../helpers";
import { ResponseBuilder, logger } from "../apptile-common";
import { IShopifyCredentials } from "../types";

export async function auth(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const appId = req.headers["x-shopify-app-id"] as string;

    if (!appId) {
      logger.debug(`authenticated appId missing`);
      res.status(401).json({
        message: "Unauthorized!, appId missing",
      });
      return;
    }

    const shopifyCreds = (await apptileClient.getAppCredentials(
      appId,
      "shopify"
    )) as IShopifyCredentials;

    logger.info(`authenticated shopifyCreds fetched`, shopifyCreds);

    if (!shopifyCreds) {
      res.status(401).json({ message: "Unauthorized!, appId missing" });
      return;
    } else {
      logger.info(`authenticated was successful`);
      next();
      return;
    }
  } catch (error) {
    res.status(401).json({ message: "shopifyAuth failed!!" });
    logger.error(`shopifyAuth failed`, error);
    console.trace(error);
    ResponseBuilder.InternalServerError(res, error);
    return;
  }
}

