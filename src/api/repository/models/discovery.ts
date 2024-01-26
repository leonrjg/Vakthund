import { Model, Sequelize, DataTypes } from 'sequelize';

export default class Discovery extends Model {
  declare id: number;

  declare alias?: string;

  declare url: string;

  declare ip: string;

  declare device_id: number;

  declare tags: string;

  declare last_updated: Date;

  declare comment: string;

  declare source: string;
}
export const DiscoveryMap = (sequelize: Sequelize) => {
  Discovery.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    alias: {
      type: DataTypes.STRING(40),
    },
    url: {
      type: DataTypes.STRING,
      unique: true,
    },
    ip: {
      type: DataTypes.STRING(40),
      allowNull: false,
      unique: true,
    },
    device_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tags: {
      type: DataTypes.TEXT,
    },
    last_updated: {
      type: DataTypes.DATE,
    },
    full_data: {
      type: DataTypes.TEXT,
    },
    source: {
      type: DataTypes.STRING(60),
    },
  }, {
    sequelize,
    tableName: 'vakthund_discoveries',
    timestamps: false,
    underscored: true,
  });
};