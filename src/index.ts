import express from 'express';
import { AppConfig } from "./config";
import {
  defaultErrorHandler,
  httpRequestTracer,
  logger,
  requestLogger,
} from "./apptile-common";
import AppDatabase from "./database";
import LiveSellingAnalytics from "./routes";

const main = async () => {
  AppDatabase.connect(AppConfig.db.main);
  // dbInit();
  const app = express();
  app.use(httpRequestTracer);
  app.use(requestLogger);

  // app.use('/front',  RetentionRouter);
  // app.use('/authenticated', shopifyAuthenticated, PlansRouter);
  app.use(defaultErrorHandler);

  app.use("/api/analytics/stream", LiveSellingAnalytics);
  app.listen(AppConfig.app.port, () => {
    logger.debug(`Listening on port ${AppConfig.app.port}`);
  });
};

main().catch((err) => {
  // tslint:disable-next-line: no-console
  logger.error(err);
});
