import { Model, Sequelize, DataTypes } from 'sequelize';
export default class Action extends Model {
  declare id: number;

  declare deviceId: number;

  declare title: string;

  declare cmd: string;

  declare executeOnDiscovery: boolean;

}
export const ActionMap = (sequelize: Sequelize) => {
  Action.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    device_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    cmd: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    execute_on_discovery: {
      type: DataTypes.BOOLEAN,
    },
  }, {
    sequelize,
    tableName: 'vakthund_actions',
    timestamps: false,
    underscored: true,
  });
};