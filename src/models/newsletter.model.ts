import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface NewsletterLead {
  id: number;
  email: string;
  status: 'active' | 'unsubscribed';
  created_at: Date;
}

interface NewsletterCreationAttributes extends Optional<NewsletterLead, 'id' | 'status' | 'created_at'> {}

class NewsletterModel extends Model<NewsletterLead, NewsletterCreationAttributes> implements NewsletterLead {
  public id!: number;
  public email!: string;
  public status!: 'active' | 'unsubscribed';
  public created_at!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

NewsletterModel.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    status: { type: DataTypes.ENUM('active', 'unsubscribed'), defaultValue: 'active' },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { 
    sequelize, 
    tableName: 'newsletter_leads', 
    timestamps: false 
  }
);

export default NewsletterModel;
