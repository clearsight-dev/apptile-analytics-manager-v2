import express, { Router } from "express";
import { Sequelize } from "sequelize";
import {
  getViewStreamModel,
  getStreamAddToCartModel,
  getStreamPurchaseModel,
} from "../model/LiveSellingEventModel";
import { auth } from "../middlewares/auth";

const LiveSellingAnalytics = Router();
LiveSellingAnalytics.use(express.json());

function convertAPPIDToUUID(uuid) {
  return uuid.replace(/-/g, "_");
}

LiveSellingAnalytics.get(
  "/:streamId/add-to-cart",
  auth,
  async (req: express.Request, res: express.Response) => {
    try {
      const appId = req.headers["x-shopify-app-id"] as string;
      const schemaId = convertAPPIDToUUID(appId);
      const streamId = req.params.streamId;

      if (!appId) {
        return res
          .status(400)
          .json({ error: "App ID is missing in the headers" });
      }

      if (!streamId) {
        return res
          .status(400)
          .json({ error: "Stream ID is missing in the parameters" });
      }
      schemaId;
      const Stream = getStreamAddToCartModel(schemaId);

      const countResult = await Stream.count({
        where: {
          stream_id: streamId,
        },
      });

      if (!countResult) {
        return res.status(200).json({
          message:
            "No add to cart event data found for the specified stream ID.",
          result: { stream_id: streamId, count: 0 },
        });
      }

      return res.status(200).json({
        message: "success",
        result: { stream_id: streamId, count: countResult },
      });
    } catch (error) {
      console.error("Error fetching cart additions:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

LiveSellingAnalytics.post(
  "/:streamId/views",
  async (req: express.Request, res: express.Response) => {
    try {
      const streamId = req.params.streamId;
      const { schemaName } = req.body;

      if (!streamId) {
        return res
          .status(400)
          .json({ error: "Stream ID is missing in the parameters" });
      }

      if (!schemaName) {
        return res
          .status(400)
          .json({ error: "Schema name is missing in the request body" });
      }

      const ViewStream = getViewStreamModel(schemaName);

      const result = await ViewStream.findOne({
        attributes: [
          [Sequelize.fn("MAX", Sequelize.col("count")), "largestCount"],
        ],
        where: {
          stream_id: streamId,
        },
        raw: true,
      });

      if (!result) {
        return res.status(200).json({
          message: "No data found for the specified stream ID.",
          result: {
            streamId: streamId,
            peakCount: 0,
          },
        });
      }

      const largestCount = result["largestCount"];

      // Check if largestCount is null or undefined
      if (largestCount === null || largestCount === undefined) {
        return res.status(200).json({
          message: "No data found for the specified stream ID.",
          result: {
            streamId: streamId,
            peakCount: 0,
          },
        });
      }

      return res.status(200).json({
        message: "success",
        result: { stream_id: streamId, peakCount: largestCount },
      });
    } catch (error) {
      console.error("Error fetching views:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

LiveSellingAnalytics.get(
  "/:streamId/sales",
  auth,
  async (req: express.Request, res: express.Response) => {
    try {
      const streamId = req.params.streamId;
      const appId = req.headers["x-shopify-app-id"] as string;
      const schemaId = convertAPPIDToUUID(appId);

      if (!appId) {
        return res
          .status(400)
          .json({ error: "App ID is missing in the headers" });
      }

      if (!streamId) {
        return res
          .status(400)
          .json({ error: "Stream ID is missing in the parameters" });
      }

      const StreamPurchase = getStreamPurchaseModel(schemaId);

      // Query to sum up total sales value
      const result = await StreamPurchase.findOne({
        attributes: [
          [
            Sequelize.fn("SUM", Sequelize.col("total_value")),
            "totalSalesValue",
          ],
          [Sequelize.fn("COUNT", Sequelize.col("order_id")), "orderCount"],
        ],
        where: {
          stream_id: streamId,
        },
        raw: true,
      });
      console.log(result);

      if (!result) {
        return res.status(200).json({
          message: "No sales data found for the specified stream ID.",
          result: {
            stream_id: streamId,
            totalSalesValue: 0,
            totalOrderCount: 0,
            averageOrderValue: 0,
          },
        });
      }
      const totalSalesValue = parseFloat(result["totalSalesValue"]) || 0;
      const totalOrderCount = parseInt(result["orderCount"], 10) || 0;

      const averageOrderValue =
        totalOrderCount > 0 ? totalSalesValue / totalOrderCount : 0;

      return res.status(200).json({
        message: "success",
        result: {
          stream_id: streamId,
          totalSalesValue,
          totalOrderCount,
          averageOrderValue: averageOrderValue.toFixed(2),
        },
      });
    } catch (error) {
      console.error("Error fetching sales value:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

export default LiveSellingAnalytics;
