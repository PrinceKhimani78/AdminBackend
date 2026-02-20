import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { Category } from '../modules/lookup/lookup.types';
import IndustryModel from './industry.model';

interface CategoryCreationAttributes extends Optional<Category, 'id' | 'created_at'> { }

class CategoryModel extends Model<Category, CategoryCreationAttributes> implements Category {
    public id!: number;
    public industry_id!: number;
    public name!: string;
    public created_at!: Date;

    // Timestamps
    public readonly createdAt!: Date;
}

CategoryModel.init(
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        industry_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: IndustryModel, key: 'id' } },
        name: { type: DataTypes.STRING(150), allowNull: false },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    { sequelize, tableName: 'categories', timestamps: false }
);

CategoryModel.belongsTo(IndustryModel, { foreignKey: 'industry_id', as: 'industry', onDelete: 'CASCADE' });

export default CategoryModel;
