import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { State } from '../modules/lookup/lookup.types';

interface StateCreationAttributes extends Optional<State, 'id'> {}

class StateModel extends Model<State, StateCreationAttributes> implements State {
  public id!: number;
  public name!: string;
  public country_id!: number;
}

StateModel.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    country_id: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, tableName: 'states', timestamps: false }
);

export default StateModel;
