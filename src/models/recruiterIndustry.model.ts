import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import Recruiter from './recruiter.model';
import IndustryModel from './industry.model';

class RecruiterIndustry extends Model {
    public recruiter_id!: string;
    public industry_id!: number;
}

RecruiterIndustry.init(
    {
        recruiter_id: {
            type: DataTypes.CHAR(36),
            primaryKey: true,
            allowNull: false,
            references: {
                model: 'recruiters',
                key: 'id',
            },
        },
        industry_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: 'industries',
                key: 'id',
            },
        },
    },
    {
        sequelize,
        modelName: 'RecruiterIndustry',
        tableName: 'recruiter_industries',
        timestamps: false,
    }
);

export default RecruiterIndustry;
