import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { Candidate } from '../modules/candidate/candidateTypes';

interface CandidateCreationAttributes extends Optional<Candidate, 'id' | 'created_at' | 'updated_at'> {}

class CandidateModel extends Model<Candidate, CandidateCreationAttributes> implements Candidate {
  public id!: string;
  public full_name!: string;
  public surname?: string;
  public email!: string;
  public mobile_number!: string;
  public gender!: 'Male' | 'Female' | 'Other';
  public date_of_birth?: Date | null;
  public address?: string;
  public country?: string;
  public state?: string;
  public city?: string;
  public position?: string;
  public experienced?: boolean;
  public fresher?: boolean;
  public expected_salary?: string;
  public job_category?: string;
  public current_location?: string;
  public interview_availability?: string;
  public availability_start?: Date | null;
  public availability_end?: Date | null;
  public preferred_shift?: string;
  public profile_photo?: string;
  public resume?: string;
  public ip_address?: string;
  public status!: 'Active' | 'Inactive';
  public readonly created_at?: Date;
  public readonly updated_at?: Date;
}

CandidateModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    full_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    surname: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    mobile_number: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM('Male', 'Female', 'Other'),
      allowNull: false,
    },
    date_of_birth: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    position: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    experienced: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    fresher: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    expected_salary: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    job_category: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    current_location: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    interview_availability: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    availability_start: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    availability_end: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    preferred_shift: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    profile_photo: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    resume: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('Active', 'Inactive'),
      allowNull: false,
      defaultValue: 'Active',
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'candidate_profiles',
    timestamps: false,
  }
);

export default CandidateModel;
