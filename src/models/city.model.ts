import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { City } from '../modules/lookup/lookup.types';

interface CityCreationAttributes extends Optional<City, 'id'> {}

class CityModel extends Model<City, CityCreationAttributes> implements City {
  public id!: number;
  public name!: string;
  public state_id!: number;
}

CityModel.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    state_id: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, tableName: 'cities', timestamps: false }
);

export default CityModel;
