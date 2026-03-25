import { QueryInterface, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export const up = async (): Promise<void> => {
    const queryInterface: QueryInterface = sequelize.getQueryInterface();

    // 1. Update status ENUM to include 'PendingApproval'
    // Note: MySQL doesn't support easy ALTER on ENUM without dropping and recreating or using raw query.
    // However, we can add it to the column definition.
    await queryInterface.changeColumn('recruiters', 'status', {
        type: DataTypes.ENUM('Active', 'Inactive', 'PendingApproval'),
        allowNull: false,
        defaultValue: 'PendingApproval',
    });

    // 2. Add pending_industries column to recruiters
    await queryInterface.addColumn('recruiters', 'pending_industries', {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: '[]',
    });

    // 3. Create recruiter_industries junction table
    await queryInterface.createTable('recruiter_industries', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
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
        industry_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'industries',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    });

    console.log('✅ Recruiter approval and industry association migration completed');
};

export const down = async (): Promise<void> => {
    const queryInterface: QueryInterface = sequelize.getQueryInterface();

    await queryInterface.dropTable('recruiter_industries');
    await queryInterface.removeColumn('recruiters', 'pending_industries');
    
    // Revert status ENUM
    await queryInterface.changeColumn('recruiters', 'status', {
        type: DataTypes.ENUM('Active', 'Inactive'),
        allowNull: false,
        defaultValue: 'Active',
    });
};
