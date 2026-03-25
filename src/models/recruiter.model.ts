import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import Job from './job.model';
import IndustryModel from './industry.model';
import RecruiterIndustry from './recruiterIndustry.model';

class Recruiter extends Model {
    public id!: string;
    public email!: string;
    public password!: string;
    public full_name!: string;
    public company_name!: string;
    public mobile_number!: string;
    public status!: 'Active' | 'Inactive' | 'PendingApproval';
    public pending_industries!: any; // Store as JSON
    public denied_industries!: any; // Store as JSON
    public readonly created_at!: Date;
    public readonly updated_at!: Date;

    // Associations
    public readonly jobs?: Job[];
}

Recruiter.init(
    {
        id: {
            type: DataTypes.CHAR(36),
            primaryKey: true,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        full_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        company_name: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        mobile_number: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM('Active', 'Inactive', 'PendingApproval'),
            allowNull: false,
            defaultValue: 'PendingApproval',
        },
        pending_industries: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: [],
        },
        denied_industries: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: [],
        },
    },
    {
        sequelize,
        modelName: 'Recruiter',
        tableName: 'recruiters',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);

Recruiter.hasMany(Job, {
    foreignKey: 'recruiter_id',
    as: 'jobs'
});

Job.belongsTo(Recruiter, {
    foreignKey: 'recruiter_id',
    as: 'recruiter'
});

Recruiter.belongsToMany(IndustryModel, {
    through: RecruiterIndustry,
    foreignKey: 'recruiter_id',
    otherKey: 'industry_id',
    as: 'industries'
});

IndustryModel.belongsToMany(Recruiter, {
    through: RecruiterIndustry,
    foreignKey: 'industry_id',
    otherKey: 'recruiter_id',
    as: 'recruiters'
});

export default Recruiter;
