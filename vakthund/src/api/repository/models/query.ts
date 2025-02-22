import { Model, Sequelize, DataTypes } from 'sequelize';
export default class Query extends Model {
  declare id: number;

  declare device_id: number;

  declare query: string;

  declare engine: string;

  declare enabled: boolean;
}
export const QueryMap = (sequelize: Sequelize) => {
  Query.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    device_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    query: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    engine: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    }
  }, {
    sequelize,
    tableName: 'vakthund_queries',
    timestamps: false,
    underscored: true,
  });
};