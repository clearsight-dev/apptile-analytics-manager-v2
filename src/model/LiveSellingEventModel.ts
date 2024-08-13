import DataTypes from "sequelize";
import { sequelize } from "../helpers/sequalize";

export const getStreamAddToCartModel = (appId: string) => {
  return sequelize.define(
    "Stream",
    {
      stream_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // Add other columns as needed
      currency: {
        type: DataTypes.STRING,
      },
      price: {
        type: DataTypes.DECIMAL,
      },
      productId: {
        type: DataTypes.STRING,
      },
      quantity: {
        type: DataTypes.INTEGER,
      },
      title: {
        type: DataTypes.STRING,
      },
      variantId: {
        type: DataTypes.STRING,
      },
      variantTitle: {
        type: DataTypes.STRING,
      },
    },
    {
      schema: appId,
      tableName: "stream_add_to_cart",
      timestamps: false,
    }
  );
};

export const getViewStreamModel = (schemaName: string) => {
  return sequelize.define(
    "ViewStream",
    {
      stream_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      count: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    },
    {
      schema: schemaName,
      tableName: "view_stream",
      timestamps: false,
    }
  );
};

export const getStreamPurchaseModel = (appId: string) => {
  return sequelize.define(
    'StreamPurchase',
    {
      currency: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      total_value: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      total_items: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      order_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      order_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      stream_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      schema: appId,
      tableName: 'stream_purchase',
      timestamps: false,
    }
  );
};
