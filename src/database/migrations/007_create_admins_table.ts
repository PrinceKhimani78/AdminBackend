import { QueryInterface, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export const up = async (): Promise<void> => {
    const queryInterface: QueryInterface = sequelize.getQueryInterface();

    await queryInterface.createTable('admins', {
        id: {
            type: DataTypes.CHAR(36),
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(255),
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
        role: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'admin',
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

    console.log('✅ Admins table created');
};

export const down = async (): Promise<void> => {
    const queryInterface: QueryInterface = sequelize.getQueryInterface();
    await queryInterface.dropTable('admins');
    console.log('✅ Admins table dropped');
};
