import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import Job from './job.model';
import CandidateModel from './candidateProfile.model';

class JobApplication extends Model {
    public id!: string;
    public job_id!: string;
    public candidate_id!: string;
    public status!: 'Applied' | 'Shortlisted' | 'Interviewed' | 'Rejected' | 'Selected';
    public applied_at!: Date;
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

JobApplication.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        job_id: {
            type: DataTypes.CHAR(36),
            allowNull: false,
            references: {
                model: 'jobs',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        candidate_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'candidate_profiles',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        status: {
            type: DataTypes.ENUM('Applied', 'Shortlisted', 'Interviewed', 'Rejected', 'Selected'),
            allowNull: false,
            defaultValue: 'Applied',
        },
        applied_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        modelName: 'JobApplication',
        tableName: 'job_applications',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);

// Associations
JobApplication.belongsTo(Job, { foreignKey: 'job_id' });
JobApplication.belongsTo(CandidateModel, { foreignKey: 'candidate_id' });

Job.hasMany(JobApplication, { foreignKey: 'job_id' });
CandidateModel.hasMany(JobApplication, { foreignKey: 'candidate_id' });

export default JobApplication;
