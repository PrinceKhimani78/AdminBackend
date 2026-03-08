import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
    await queryInterface.addColumn('admins', 'username', {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
        after: 'name'
    } as any);
}

export async function down(queryInterface: QueryInterface) {
    await queryInterface.removeColumn('admins', 'username');
}
