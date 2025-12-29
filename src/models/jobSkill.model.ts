import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { JobSkill } from '../modules/lookup/lookup.types';

interface JobSkillCreationAttributes extends Optional<JobSkill, 'id'> {}

class JobSkillModel extends Model<JobSkill, JobSkillCreationAttributes> implements JobSkill {
  public id!: number;
  public skill_name!: string;
  public status!: 'Active' | 'Inactive';
}

JobSkillModel.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    skill_name: { type: DataTypes.TEXT('long'), allowNull: false },
    status: { type: DataTypes.ENUM('Active', 'Inactive'), defaultValue: 'Active' },
  },
  { sequelize, tableName: 'job_skills', timestamps: false }
);

export default JobSkillModel;
