import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { JobFunction } from '../modules/lookup/lookup.types';

interface JobFunctionCreationAttributes extends Optional<JobFunction, 'id'> {}

class JobFunctionModel extends Model<JobFunction, JobFunctionCreationAttributes> implements JobFunction {
  public id!: number;
  public job_function_name!: string;
  public status!: 'Active' | 'Inactive';
}

JobFunctionModel.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    job_function_name: { type: DataTypes.STRING(255), allowNull: false },
    status: { type: DataTypes.ENUM('Active', 'Inactive'), defaultValue: 'Active' },
  },
  { sequelize, tableName: 'job_functions', timestamps: false }
);

export default JobFunctionModel;
