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

      // const Stream = getStreamAddToCartModel(schemaId);

      let Stream;
      try {
        Stream = getStreamAddToCartModel(schemaId);
      } catch (error) {
        return res.status(200).json({
          message: "Internal Server Error while defining model",
          result: { stream_id: streamId, count: 0 },
        });
      }

      try {
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
        if (
          error.name === "SequelizeDatabaseError" &&
          error.parent.code === "42P01"
        ) {
          return res.status(200).json({
            message: "The schema streamAddToCart for this App ID does not exist",
            result: { stream_id: streamId, count: 0 },
          });
        }

        console.error("Error fetching cart additions:", error);
        return res
          .status(200)
          .json({
            message: "Internal Server Error. Error fetching add to cart",
            result: { stream_id: streamId, count: 0 },
          });
      }
    } catch (error) {
      console.error("Unexpected Error:", error);
      return res
        .status(500)
        .json({ error: "Unexpected Internal Server Error" });
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

      // const ViewStream = getViewStreamModel(schemaName);
      let ViewStream;
      try {
        ViewStream = getViewStreamModel(schemaName);
      } catch (error) {
        return res.status(200).json({
          message: "Internal Server Error while defining model",
          result: {
            streamId: streamId,
            peakCount: 0,
          },
        });
      }

      try {
        const result = await ViewStream.findOne({
          attributes: [
            [Sequelize.fn("MAX", Sequelize.col("count")), "largestCount"],
          ],
          where: {
            stream_id: streamId,
          },
          raw: true,
        });

        if (!result || result["largestCount"] === null || result["largestCount"] === undefined) {
          return res.status(200).json({
            message: "No data found for the specified stream ID.",
            result: {
              streamId: streamId,
              peakCount: 0,
            },
          });
        }

        const largestCount = result["largestCount"];

        return res.status(200).json({
          message: "success",
          result: { stream_id: streamId, peakCount: largestCount },
        });
      } catch (error) {
        if (error.name === "SequelizeDatabaseError" && error.parent.code === "42P01") {
          return res.status(200).json({
            message: `The schema or table for this schema name does not exist`,
            result: {
              streamId: streamId,
              peakCount: 0,
            },
          });
        }

        console.error("Error fetching views:", error);
        return res.status(200).json({ message: "Internal Server Error",result: {
          streamId: streamId,
          peakCount: 0,
        }, });
      }
    } catch (error) {
      console.error("Unexpected Error:", error);
      return res.status(500).json({ error: "Unexpected Internal Server Error" });
    }
  }
);

LiveSellingAnalytics.get(
  "/:streamId/sales",
  // auth,
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

      let StreamPurchase;
      try {
        StreamPurchase = getStreamPurchaseModel(schemaId);
      } catch (error) {
        return res.status(200).json({
          message: "Internal Server Error while defining model",
          result: {
            stream_id: streamId,
            totalSalesValue: 0,
            totalOrderCount: 0,
            averageOrderValue: 0,
          },
        });
      }

      try {
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
        if (
          error.name === "SequelizeDatabaseError" &&
          error.parent.code === "42P01"
        ) {
          return res.status(200).json({
            message: "The schema streamPurchase for this App ID does not exist",
            result: {
              stream_id: streamId,
              totalSalesValue: 0,
              totalOrderCount: 0,
              averageOrderValue: 0,
            },
          });
        }

        console.error("Error fetching sales value:", error);
        return res.status(200).json({
          message: "Internal Server Error. Error fetching sales value:",
          result: {
            stream_id: streamId,
            totalSalesValue: 0,
            totalOrderCount: 0,
            averageOrderValue: 0,
          },
        });
      }
    } catch (error) {
      console.error("Unexpected Error:", error);
      return res
        .status(500)
        .json({ error: "Unexpected Internal Server Error" });
    }
  }
);

export default LiveSellingAnalytics;
