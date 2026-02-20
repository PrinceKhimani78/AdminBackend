import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { JobRole } from '../modules/lookup/lookup.types';
import CategoryModel from './category.model';

interface JobRoleCreationAttributes extends Optional<JobRole, 'id' | 'created_at'> { }

class JobRoleModel extends Model<JobRole, JobRoleCreationAttributes> implements JobRole {
    public id!: number;
    public category_id!: number;
    public name!: string;
    public created_at!: Date;
}

JobRoleModel.init(
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        category_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: CategoryModel, key: 'id' } },
        name: { type: DataTypes.STRING(150), allowNull: false },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    { sequelize, tableName: 'job_roles', timestamps: false }
);

JobRoleModel.belongsTo(CategoryModel, { foreignKey: 'category_id', as: 'category', onDelete: 'CASCADE' });

export default JobRoleModel;
