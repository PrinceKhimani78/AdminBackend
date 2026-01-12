import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface CandidateEducation {
    id: string;
    candidate_id: string;
    degree: string;
    university: string;
    passing_year: string;
    created_at?: Date;
}

interface CandidateEducationCreationAttributes extends Optional<CandidateEducation, 'id' | 'created_at'> { }

class CandidateEducationModel extends Model<CandidateEducation, CandidateEducationCreationAttributes> implements CandidateEducation {
    public id!: string;
    public candidate_id!: string;
    public degree!: string;
    public university!: string;
    public passing_year!: string;
    public readonly created_at?: Date;
}

CandidateEducationModel.init(
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
        degree: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        university: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        passing_year: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'candidate_education',
        timestamps: false,
    }
);

export default CandidateEducationModel;
