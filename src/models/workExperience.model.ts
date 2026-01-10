import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { WorkExperience } from '../modules/candidate/workExperience.types';

interface WorkExperienceCreationAttributes extends Optional<WorkExperience, 'id' | 'created_at'> { }

class WorkExperienceModel extends Model<WorkExperience, WorkExperienceCreationAttributes> implements WorkExperience {
  public id!: string;
  public candidate_id!: string;
  public position!: string;
  public company!: string;
  public start_date!: Date | null;
  public end_date!: Date | null;
  public salary_period!: string;
  public current_wages?: number;
  public current_city?: string;
  public current_village?: string;
  public is_current!: boolean;
  public readonly created_at?: Date;
}

WorkExperienceModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    candidate_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    position: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    company: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    salary_period: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    current_wages: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    current_city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    current_village: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    is_current: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'candidate_work_experience',
    timestamps: false,
  }
);

export default WorkExperienceModel;
