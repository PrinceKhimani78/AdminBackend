import { QueryInterface, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export const up = async (): Promise<void> => {
    const queryInterface: QueryInterface = sequelize.getQueryInterface();

    const tableInfo = await queryInterface.describeTable('candidate_profiles');

    if (!tableInfo.pincode) {
        await queryInterface.addColumn('candidate_profiles', 'pincode', {
            type: DataTypes.STRING(10),
            allowNull: true,
        });
        console.log('✅ pincode column added to candidate_profiles table');
    } else {
        console.log('⏭️ pincode column already exists in candidate_profiles table');
    }
};

export const down = async (): Promise<void> => {
    const queryInterface: QueryInterface = sequelize.getQueryInterface();

    const tableInfo = await queryInterface.describeTable('candidate_profiles');

    if (tableInfo.pincode) {
        await queryInterface.removeColumn('candidate_profiles', 'pincode');
        console.log('✅ pincode column removed from candidate_profiles table');
    } else {
        console.log('⏭️ pincode column does not exist in candidate_profiles table');
    }
};
