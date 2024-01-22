import { Model, Sequelize, DataTypes } from 'sequelize';

export default class Device extends Model {
  declare id: number;

  declare name: string;
}
export const DeviceMap = (sequelize: Sequelize) => {
  Device.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
    },
  }, {
    sequelize,
    tableName: 'vakthund_devices',
    timestamps: false,
    underscored: true,
  });
};