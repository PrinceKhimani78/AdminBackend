import CountryModel from '../../models/country.model';
import StateModel from '../../models/state.model';
import CityModel from '../../models/city.model';
import JobFunctionModel from '../../models/jobFunction.model';
import JobSkillModel from '../../models/jobSkill.model';
import IndustryModel from '../../models/industry.model';
import CategoryModel from '../../models/category.model';
import JobRoleModel from '../../models/jobRole.model';
import { Country, State, City, JobFunction, JobSkill, Industry, Category, JobRole } from './lookup.types';
import { handleServiceCall, handleDBError } from '../../utils/serviceHandlerUtil';
import { Op } from 'sequelize';

export const getCountries = async (): Promise<Country[]> => {
  return handleServiceCall(async () => {
    try {
      return await CountryModel.findAll({ order: [['name', 'ASC']] });
    } catch (error) {
      console.error('Error in getCountries:', error);
      return handleDBError(error, 'Failed to retrieve countries');
    }
  });
};

export const getStates = async (country_id?: number): Promise<State[]> => {
  return handleServiceCall(async () => {
    try {
      const where = country_id ? { country_id } : {};
      return await StateModel.findAll({ where, order: [['name', 'ASC']] });
    } catch (error) {
      console.error('Error in getStates:', error);
      return handleDBError(error, 'Failed to retrieve states');
    }
  });
};

export const getCities = async (state_id?: number): Promise<City[]> => {
  return handleServiceCall(async () => {
    try {
      const where = state_id ? { state_id } : {};
      return await CityModel.findAll({ where, order: [['name', 'ASC']] });
    } catch (error) {
      console.error('Error in getCities:', error);
      return handleDBError(error, 'Failed to retrieve cities');
    }
  });
};

export const getJobFunctions = async (): Promise<JobFunction[]> => {
  return handleServiceCall(async () => {
    try {
      return await JobFunctionModel.findAll({ where: { status: 'Active' } });
    } catch (error) {
      console.error('Error in getJobFunctions:', error);
      return handleDBError(error, 'Failed to retrieve job functions');
    }
  });
};

export const getJobSkills = async (): Promise<JobSkill[]> => {
  return handleServiceCall(async () => {
    try {
      return await JobSkillModel.findAll({ where: { status: 'Active' } });
    } catch (error) {
      console.error('Error in getJobSkills:', error);
      return handleDBError(error, 'Failed to retrieve job skills');
    }
  });
};

export const getIndustries = async (limit?: number, offset?: number, search?: string): Promise<{ rows: Industry[], count: number }> => {
  return handleServiceCall(async () => {
    try {
      const whereCondition = search ? { name: { [Op.like]: `%${search}%` } } : {};
      return await IndustryModel.findAndCountAll({
        where: whereCondition,
        limit: limit ? limit : undefined,
        offset: offset ? offset : undefined,
        order: [['name', 'ASC']]
      });
    } catch (error) {
      console.error('Error in getIndustries:', error);
      return handleDBError(error, 'Failed to retrieve industries');
    }
  });
};

export const getCategories = async (industry_id?: number, limit?: number, offset?: number, search?: string): Promise<{ rows: Category[], count: number }> => {
  return handleServiceCall(async () => {
    try {
      const whereCondition: any = {};
      if (industry_id) whereCondition.industry_id = industry_id;
      if (search) whereCondition.name = { [Op.like]: `%${search}%` };

      return await CategoryModel.findAndCountAll({
        where: whereCondition,
        limit: limit ? limit : undefined,
        offset: offset ? offset : undefined,
        order: [['name', 'ASC']]
      });
    } catch (error) {
      console.error('Error in getCategories:', error);
      return handleDBError(error, 'Failed to retrieve categories');
    }
  });
};

export const getJobRoles = async (category_id?: number, limit?: number, offset?: number, search?: string): Promise<{ rows: JobRole[], count: number }> => {
  return handleServiceCall(async () => {
    try {
      const whereCondition: any = {};
      if (category_id) whereCondition.category_id = category_id;
      if (search) whereCondition.name = { [Op.like]: `%${search}%` };

      return await JobRoleModel.findAndCountAll({
        where: whereCondition,
        limit: limit ? limit : undefined,
        offset: offset ? offset : undefined,
        order: [['name', 'ASC']]
      });
    } catch (error) {
      console.error('Error in getJobRoles:', error);
      return handleDBError(error, 'Failed to retrieve job roles');
    }
  });
};
// CRUD Methods for Industries

export const getIndustryById = async (id: number): Promise<Industry | null> => {
  return handleServiceCall(async () => {
    try {
      return await IndustryModel.findByPk(id);
    } catch (error) {
      console.error('Error in getIndustryById:', error);
      return handleDBError(error, 'Failed to retrieve industry');
    }
  });
};

export const createIndustry = async (data: { name: string; slug: string }): Promise<Industry> => {
  return handleServiceCall(async () => {
    try {
      return await IndustryModel.create(data);
    } catch (error) {
      console.error('Error in createIndustry:', error);
      return handleDBError(error, 'Failed to create industry');
    }
  });
};

export const updateIndustries = async (data: any[]): Promise<Industry[]> => {
  return handleServiceCall(async () => {
    const transaction = await IndustryModel.sequelize!.transaction();
    try {
      const updatedIndustries: Industry[] = [];
      for (const item of data) {
        if (!item.id) {
          throw new Error('ID is required for update');
        }
        await IndustryModel.update(
          { name: item.name, slug: item.slug },
          { where: { id: item.id }, transaction }
        );
        const updated = await IndustryModel.findByPk(item.id, { transaction });
        if (updated) updatedIndustries.push(updated);
      }
      await transaction.commit();
      return updatedIndustries;
    } catch (error) {
      await transaction.rollback();
      console.error('Error in updateIndustries:', error);
      return handleDBError(error, 'Failed to update industries');
    }
  });
};

// CRUD Methods for Categories

export const getCategoryById = async (id: number): Promise<Category | null> => {
  return handleServiceCall(async () => {
    try {
      return await CategoryModel.findByPk(id);
    } catch (error) {
      console.error('Error in getCategoryById:', error);
      return handleDBError(error, 'Failed to retrieve category');
    }
  });
};

export const createCategory = async (data: { industry_id: number; name: string }): Promise<Category> => {
  return handleServiceCall(async () => {
    try {
      return await CategoryModel.create(data);
    } catch (error) {
      console.error('Error in createCategory:', error);
      return handleDBError(error, 'Failed to create category');
    }
  });
};

export const updateCategories = async (data: any[]): Promise<Category[]> => {
  return handleServiceCall(async () => {
    const transaction = await CategoryModel.sequelize!.transaction();
    try {
      const updatedCategories: Category[] = [];
      for (const item of data) {
        if (!item.id) {
          throw new Error('ID is required for update');
        }
        await CategoryModel.update(
          { industry_id: item.industry_id, name: item.name },
          { where: { id: item.id }, transaction }
        );
        const updated = await CategoryModel.findByPk(item.id, { transaction });
        if (updated) updatedCategories.push(updated);
      }
      await transaction.commit();
      return updatedCategories;
    } catch (error) {
      await transaction.rollback();
      console.error('Error in updateCategories:', error);
      return handleDBError(error, 'Failed to update categories');
    }
  });
};

// CRUD Methods for Job Roles

export const getJobRoleById = async (id: number): Promise<JobRole | null> => {
  return handleServiceCall(async () => {
    try {
      return await JobRoleModel.findByPk(id);
    } catch (error) {
      console.error('Error in getJobRoleById:', error);
      return handleDBError(error, 'Failed to retrieve job role');
    }
  });
};

export const createJobRole = async (data: { category_id: number; name: string }): Promise<JobRole> => {
  return handleServiceCall(async () => {
    try {
      return await JobRoleModel.create(data);
    } catch (error) {
      console.error('Error in createJobRole:', error);
      return handleDBError(error, 'Failed to create job role');
    }
  });
};

export const updateJobRoles = async (data: any[]): Promise<JobRole[]> => {
  return handleServiceCall(async () => {
    const transaction = await JobRoleModel.sequelize!.transaction();
    try {
      const updatedJobRoles: JobRole[] = [];
      for (const item of data) {
        if (!item.id) {
          throw new Error('ID is required for update');
        }
        await JobRoleModel.update(
          { category_id: item.category_id, name: item.name },
          { where: { id: item.id }, transaction }
        );
        const updated = await JobRoleModel.findByPk(item.id, { transaction });
        if (updated) updatedJobRoles.push(updated);
      }
      await transaction.commit();
      return updatedJobRoles;
    } catch (error) {
      await transaction.rollback();
      console.error('Error in updateJobRoles:', error);
      return handleDBError(error, 'Failed to update job roles');
    }
  });
};

// DELETE Methods

export const deleteIndustry = async (id: number): Promise<boolean> => {
  return handleServiceCall(async () => {
    try {
      const deleted = await IndustryModel.destroy({ where: { id } });
      return deleted > 0;
    } catch (error) {
      console.error('Error in deleteIndustry:', error);
      return handleDBError(error, 'Failed to delete industry');
    }
  });
};

export const deleteCategory = async (id: number): Promise<boolean> => {
  return handleServiceCall(async () => {
    try {
      const deleted = await CategoryModel.destroy({ where: { id } });
      return deleted > 0;
    } catch (error) {
      console.error('Error in deleteCategory:', error);
      return handleDBError(error, 'Failed to delete category');
    }
  });
};

export const deleteJobRole = async (id: number): Promise<boolean> => {
  return handleServiceCall(async () => {
    try {
      const deleted = await JobRoleModel.destroy({ where: { id } });
      return deleted > 0;
    } catch (error) {
      console.error('Error in deleteJobRole:', error);
      return handleDBError(error, 'Failed to delete job role');
    }
  });
};
