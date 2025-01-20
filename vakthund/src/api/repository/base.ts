import { Dialect, Sequelize } from 'sequelize';
import { Service } from 'typedi';
import { env } from 'node:process';
import { mkdirSync } from 'node:fs';
import Action, { ActionMap } from './models/action';
import Device, { DeviceMap } from './models/device';
import Discovery, { DiscoveryMap } from './models/discovery';
import Execution, { ExecutionMap } from './models/execution';
import Query, { QueryMap } from './models/query';
import path from 'path';

@Service()
export class BaseRepository {
  conn: Sequelize;

  getConnection = () => {
    if (!this.conn) {
      if (!env.db_type || env.db_type === 'sqlite') {
        let dbDir = path.resolve(__dirname, '../../../data');
        mkdirSync(dbDir, { recursive: true });
        this.conn = new Sequelize({
          dialect: 'sqlite',
          storage: path.join(dbDir, 'vakthund.db'),
        });
      } else {
        this.conn = new Sequelize(env.db_name!, env.db_user!, env.db_password!, {
          host: env.db_host!,
          dialect: env.db_type as Dialect,
          define: {
            underscored: true,
          },
        });
      }

      DeviceMap(this.conn);

      QueryMap(this.conn);
      Query.belongsTo(Device, { foreignKey: 'device_id', onDelete: 'CASCADE' });

      DiscoveryMap(this.conn);
      Discovery.belongsTo(Device, { foreignKey: 'device_id', onDelete: 'CASCADE' });

      ActionMap(this.conn);
      Action.belongsTo(Device, { foreignKey: 'device_id', onDelete: 'CASCADE' });

      ExecutionMap(this.conn);
      Execution.belongsTo(Action, { foreignKey: 'action_id', onDelete: 'CASCADE' });

      this.conn.sync();
    }
    return this.conn;
  };
}