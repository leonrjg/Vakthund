import { Model, Sequelize, DataTypes } from 'sequelize';
export default class Action extends Model {
  declare id: number;

  declare deviceId: number;

  declare title: string;

  declare cmd: string;

  declare successRegex: string;

  declare onSuccessTag: string;

  declare onFailureTag: string;

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
    success_regex: {
      type: DataTypes.STRING(100),
    },
    on_success_tag: {
      type: DataTypes.STRING,
    },
    on_failure_tag: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    tableName: 'vakthund_actions',
    timestamps: false,
    underscored: true,
  });
};