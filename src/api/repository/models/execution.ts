import { Model, Sequelize, DataTypes } from 'sequelize';
export default class Execution extends Model {
  declare id: number;

  declare actionId: number;

  declare discoveryId: number;

  declare executionDate: Date;

  declare result: string;

  declare success: boolean;

}
export const ExecutionMap = (sequelize: Sequelize) => {
  Execution.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    action_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    discovery_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    execution_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    result: {
      type: DataTypes.TEXT,
    },
    success: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  }, {
    sequelize,
    tableName: 'vakthund_executions',
    timestamps: false,
    underscored: true,
  });
};