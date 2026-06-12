import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Job from './job.model';
import CandidateProfile from './candidateProfile.model';

interface SavedJobAttributes {
    id: string;
    job_id: string;
    candidate_id: string;
    created_at?: Date;
}

interface SavedJobCreationAttributes extends Optional<SavedJobAttributes, 'created_at'> {}

class SavedJob extends Model<SavedJobAttributes, SavedJobCreationAttributes> implements SavedJobAttributes {
    public id!: string;
    public job_id!: string;
    public candidate_id!: string;
    public readonly created_at!: Date;
    
    // Associations
    public readonly job?: Job;
    public readonly candidate?: CandidateProfile;
}

SavedJob.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        job_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Job,
                key: 'id'
            }
        },
        candidate_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: CandidateProfile,
                key: 'id'
            }
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        }
    },
    {
        sequelize,
        tableName: 'saved_jobs',
        timestamps: false, // only created_at is present
        indexes: [
            {
                unique: true,
                fields: ['job_id', 'candidate_id']
            }
        ]
    }
);

// Define associations
SavedJob.belongsTo(Job, { foreignKey: 'job_id', as: 'job' });
SavedJob.belongsTo(CandidateProfile, { foreignKey: 'candidate_id', as: 'candidate' });

// Add reverse associations if necessary
// Job.hasMany(SavedJob, { foreignKey: 'job_id', as: 'saved_jobs' });
// CandidateProfile.hasMany(SavedJob, { foreignKey: 'candidate_id', as: 'saved_jobs' });

export default SavedJob;
