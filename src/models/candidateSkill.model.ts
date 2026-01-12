import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { CandidateSkill } from '../modules/candidate/workExperience.types';

interface CandidateSkillCreationAttributes extends Optional<CandidateSkill, 'id' | 'created_at'> { }

class CandidateSkillModel extends Model<CandidateSkill, CandidateSkillCreationAttributes> implements CandidateSkill {
  public id!: string;
  public candidate_id!: string;
  public skill_name!: string;
  public years_of_experience!: string;
  public level?: string;
  public readonly created_at?: Date;
}

CandidateSkillModel.init(
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
    skill_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    years_of_experience: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    level: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'candidate_skills',
    timestamps: false,
  }
);

export default CandidateSkillModel;
