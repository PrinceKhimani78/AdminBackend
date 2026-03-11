import { QueryInterface, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export const up = async (): Promise<void> => {
    const queryInterface: QueryInterface = sequelize.getQueryInterface();

    await queryInterface.createTable('job_applications', {
        id: {
            type: DataTypes.CHAR(36),
            primaryKey: true,
            allowNull: false,
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

    console.log('✅ Job applications table created');
};

export const down = async (): Promise<void> => {
    const queryInterface: QueryInterface = sequelize.getQueryInterface();
    await queryInterface.dropTable('job_applications');
    console.log('✅ Job applications table dropped');
};
