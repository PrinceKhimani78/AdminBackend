import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import Recruiter from './recruiter.model';

class Job extends Model {
    public id!: string;
    public title!: string;
    public description!: string;
    public requirements!: string;
    public location!: string;
    public department?: string;
    public job_role?: string;
    public qualifications?: string;
    public gender?: string;
    public skills?: string;
    public industry?: string;
    public languages?: string;
    public screening_questions?: string; // JSON string
    public allow_calls?: boolean;
    public contact_name?: string;
    public contact_number?: string;
    public call_time_range?: string;
    public call_days?: string;
    public status!: 'Active' | 'Expired' | 'Draft';
    public readonly created_at!: Date;
    public readonly updated_at!: Date;

    // Associations
    public readonly recruiter?: Recruiter;
    public readonly applications?: any[];
}

Job.init(
    {
        id: {
            type: DataTypes.CHAR(36),
            primaryKey: true,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        requirements: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        location: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        job_category: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        department: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        job_role: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        qualifications: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        gender: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        skills: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        industry: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        languages: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        screening_questions: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        allow_calls: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        },
        contact_name: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        contact_number: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        call_time_range: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        call_days: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        employment_type: {
            type: DataTypes.STRING(100),
            allowNull: true,
            defaultValue: 'Full-time',
        },
        salary_min: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        salary_max: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        exp_min: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        exp_max: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        company_name: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        perks_and_benefits: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        posting_as: {
            type: DataTypes.ENUM('Company', 'Consultancy'),
            allowNull: true,
            defaultValue: 'Company',
        },
        recruiter_id: {
            type: DataTypes.CHAR(36),
            allowNull: true,
            references: {
                model: 'recruiters',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        status: {
            type: DataTypes.ENUM('Active', 'Expired', 'Draft'),
            allowNull: false,
            defaultValue: 'Active',
        },
    },
    {
        sequelize,
        modelName: 'Job',
        tableName: 'jobs',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);

export default Job;
