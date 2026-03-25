import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { Industry } from '../modules/lookup/lookup.types';

interface IndustryCreationAttributes extends Optional<Industry, 'id' | 'created_at'> {}

class IndustryModel extends Model<Industry, IndustryCreationAttributes> implements Industry {
  public id!: number;
  public name!: string;
  public slug!: string;
  public created_at!: Date;
}

IndustryModel.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(150), allowNull: false },
    slug: { type: DataTypes.STRING(150), allowNull: true, unique: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { sequelize, tableName: 'industries', timestamps: false }
);

export default IndustryModel;
