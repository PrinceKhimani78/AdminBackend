import { QueryInterface, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export const up = async (): Promise<void> => {
    const queryInterface: QueryInterface = sequelize.getQueryInterface();

    // 1. Add languages_known to candidate_profiles
    const tableInfo = await queryInterface.describeTable('candidate_profiles');
    if (!tableInfo.languages_known) {
        await queryInterface.addColumn('candidate_profiles', 'languages_known', {
            type: DataTypes.JSON,
            allowNull: true,
        });
        console.log('✅ languages_known column added to candidate_profiles table');
    }

    // 2. Create candidate_certifications table
    const tables = await queryInterface.showAllTables();
    if (!tables.includes('candidate_certifications')) {
        await queryInterface.createTable('candidate_certifications', {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
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
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        });
        console.log('✅ candidate_certifications table created');
    }
};

export const down = async (): Promise<void> => {
    const queryInterface: QueryInterface = sequelize.getQueryInterface();

    await queryInterface.dropTable('candidate_certifications');
    await queryInterface.removeColumn('candidate_profiles', 'languages_known');
    console.log('✅ Reverted languages and certifications changes');
};
