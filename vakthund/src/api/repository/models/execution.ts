import { Model, Sequelize, DataTypes } from 'sequelize';

export type ExecutionType = 'action' | 'scan';
export type ExecutionStatus = 'running' | 'completed' | 'failed';

export default class Execution extends Model {
  declare id: number;

  declare actionId: number | null;

  declare discoveryId: number | null;

  declare executionDate: Date;

  declare result: string;

  declare success: boolean;

  declare type: ExecutionType;

  declare status: ExecutionStatus;

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
      allowNull: true,
    },
    discovery_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
    type: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'action',
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'completed',
    },
  }, {
    sequelize,
    tableName: 'vakthund_executions',
    timestamps: false,
    underscored: true,
  });
};
