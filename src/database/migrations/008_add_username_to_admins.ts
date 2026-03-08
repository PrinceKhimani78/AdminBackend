import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
    await queryInterface.addColumn('admins', 'username', {
        type: DataTypes.STRING(255),
        allowNull: true, // Allow null initially to avoid breaking existing records
        unique: true,
        after: 'name'
    });
}

export async function down(queryInterface: QueryInterface) {
    await queryInterface.removeColumn('admins', 'username');
}
