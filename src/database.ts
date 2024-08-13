import { Sequelize } from "sequelize";
import { merge } from "lodash";
import sequelizeOptions from "./config/database.js";
import { logger } from "./apptile-common";

const queryLogger = (sql: any, queryObject: any) => {
  logger.debug(sql);
};

class Database {
  private _sequelize: Sequelize;
  private config: object;

  connect(options = {}): void {
    if (this._sequelize) {
      return;
    }
    this.config = merge({}, sequelizeOptions["development"], options, {
      logging: queryLogger,
    });
    logger.info(this.config);
    this._sequelize = new Sequelize(this.config);
  }

  get sequelize(): Sequelize {
    if (!this._sequelize) {
      this.connect();
    }

    return this._sequelize;
  }

  close(done: CallableFunction): void {
    if (!this._sequelize) {
      done();
      return;
    }

    this._sequelize.close().then(() => done());
  }
}

const AppDatabase = new Database();

export default AppDatabase;
