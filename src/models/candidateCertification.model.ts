import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { CandidateCertification } from '../modules/candidate/workExperience.types';

interface CandidateCertificationCreationAttributes extends Optional<CandidateCertification, 'id' | 'created_at'> { }

class CandidateCertificationModel extends Model<CandidateCertification, CandidateCertificationCreationAttributes> implements CandidateCertification {
    public id!: string;
    public candidate_id!: string;
    public name!: string;
    public year?: string;
    public achievement?: string;
    public readonly created_at?: Date;
}

CandidateCertificationModel.init(
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
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        year: {
            type: DataTypes.STRING(10),
            allowNull: true,
        },
        achievement: {
            type: DataTypes.TEXT,
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
        tableName: 'candidate_certifications',
        timestamps: false,
    }
);

export default CandidateCertificationModel;
