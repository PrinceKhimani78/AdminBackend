import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { Country } from '../modules/lookup/lookup.types';

interface CountryCreationAttributes extends Optional<Country, 'id'> {}

class CountryModel extends Model<Country, CountryCreationAttributes> implements Country {
  public id!: number;
  public countryCode!: string;
  public name!: string;
}

CountryModel.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    countryCode: { type: DataTypes.CHAR(2), allowNull: false },
    name: { type: DataTypes.STRING(45), allowNull: false },
  },
  { sequelize, tableName: 'countries', timestamps: false }
);

export default CountryModel;
