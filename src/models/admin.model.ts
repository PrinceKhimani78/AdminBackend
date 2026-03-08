import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

class Admin extends Model {
    public id!: string;
    public name!: string;
    public email!: string;
    public password!: string;
    public role!: string; // 'superadmin', 'admin', etc.
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

Admin.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
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
    },
    {
        sequelize,
        tableName: 'admins',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);

export default Admin;
