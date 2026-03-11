import { QueryInterface, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export const up = async (): Promise<void> => {
    const queryInterface: QueryInterface = sequelize.getQueryInterface();

    // 1. Create Recruiters Table
    await queryInterface.createTable('recruiters', {
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
            allowNull: false,
        },
        mobile_number: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM('Active', 'Inactive'),
            allowNull: false,
            defaultValue: 'Active',
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    });

    console.log('✅ Recruiters table created');

    // 2. Create Jobs Table
    await queryInterface.createTable('jobs', {
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
            allowNull: false,
        },
        employment_type: {
            type: DataTypes.STRING(100),
            allowNull: true,
            defaultValue: 'Full-time',
        },
        salary_range: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        experience_required: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        recruiter_id: {
            type: DataTypes.CHAR(36),
            allowNull: false,
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
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    });

    console.log('✅ Jobs table created');
};

export const down = async (): Promise<void> => {
    const queryInterface: QueryInterface = sequelize.getQueryInterface();
    await queryInterface.dropTable('jobs');
    console.log('✅ Jobs table dropped');
    await queryInterface.dropTable('recruiters');
    console.log('✅ Recruiters table dropped');
};
