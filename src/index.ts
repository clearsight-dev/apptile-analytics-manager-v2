import express from 'express';
import {AppConfig} from './config';
import {shopifyAuthenticated} from './middlewares/auth';
import {defaultErrorHandler, httpRequestTracer, logger, requestLogger} from './apptile-common';

const main = async () => {
  const app = express();
  app.use(httpRequestTracer);
  app.use(requestLogger);

  // app.use('/front',  RetentionRouter);
  // app.use('/authenticated', shopifyAuthenticated, PlansRouter);
  app.use(defaultErrorHandler);

  app.listen(AppConfig.app.port, () => {
    // tslint:disable-next-line: no-console
    logger.debug(`Listening on port ${AppConfig.app.port}`);
  });
};

main().catch((err) => {
  // tslint:disable-next-line: no-console
  logger.error(err);
});
