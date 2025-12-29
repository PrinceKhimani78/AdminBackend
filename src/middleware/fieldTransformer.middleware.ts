import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to transform frontend field names to backend database schema
 * This allows the API to accept both formats:
 * - Frontend format (firstName, surName, phone, workType, etc.)
 * - Backend format (full_name, surname, mobile_number, etc.)
 */
export const transformFrontendFields = (req: Request, res: Response, next: NextFunction): void => {
  if (req.method === 'POST' || req.method === 'PUT') {
    const body = req.body;
    
    // Transform main fields
    if (body.firstName) {
      body.full_name = body.firstName;
      delete body.firstName;
    }
    
    if (body.surName) {
      body.surname = body.surName;
      delete body.surName;
    }
    
    if (body.phone) {
      // Remove +91 prefix and any non-digits
      body.mobile_number = body.phone.replace(/\D/g, '').slice(-10);
      delete body.phone;
    }
    
    // Transform workType to experienced/fresher booleans
    if (body.workType) {
      body.experienced = body.workType === 'experienced';
      body.fresher = body.workType === 'fresher';
      delete body.workType;
    }
    
    // Transform experiences array
    if (body.experiences && Array.isArray(body.experiences)) {
      body.work_experience = body.experiences.map((exp: any) => ({
        position: exp.position,
        company: exp.company,
        start_date: exp.startDate || exp.start_date,
        end_date: exp.endDate || exp.end_date,
        salary_period: exp.noticePeriod || exp.salary_period,
        is_current: exp.is_current !== undefined ? exp.is_current : !exp.endDate,
      }));
      delete body.experiences;
    }
    
    // Transform skillsList array
    if (body.skillsList && Array.isArray(body.skillsList)) {
      body.skills = body.skillsList.map((skill: any) => ({
        skill_name: skill.name || skill.skill_name,
        years_of_experience: skill.years || skill.years_of_experience,
      }));
      delete body.skillsList;
    }
    
    // Transform educationList array
    if (body.educationList && Array.isArray(body.educationList)) {
      body.education = body.educationList;
      delete body.educationList;
    }
    
    // Transform availability fields
    if (body.availabilityJobCategory) {
      body.job_category = body.availabilityJobCategory;
      delete body.availabilityJobCategory;
    }
    
    if (body.availabilityCategory) {
      body.interview_availability = body.availabilityCategory;
      delete body.availabilityCategory;
    }
    
    if (body.expectedSalaryRange) {
      body.expected_salary = body.expectedSalaryRange;
      delete body.expectedSalaryRange;
    }
    
    if (body.joiningDate) {
      body.availability_start = body.joiningDate;
      delete body.joiningDate;
    }
    
    // Transform address fields
    if (body.village || body.district) {
      const addressParts = [];
      if (body.village) addressParts.push(body.village);
      if (body.district) addressParts.push(body.district);
      if (body.city) addressParts.push(body.city);
      if (body.state) addressParts.push(body.state);
      
      if (!body.address && addressParts.length > 0) {
        body.address = addressParts.join(', ');
      }
    }
    
    if (body.availabilityState || body.availabilityCity) {
      const locationParts = [];
      if (body.availabilityVillage) locationParts.push(body.availabilityVillage);
      if (body.availabilityCity) locationParts.push(body.availabilityCity);
      if (body.availabilityDistrict) locationParts.push(body.availabilityDistrict);
      if (body.availabilityState) locationParts.push(body.availabilityState);
      
      if (!body.current_location && locationParts.length > 0) {
        body.current_location = locationParts.join(', ');
      }
    }
    
    // Set default gender if not provided
    if (!body.gender) {
      body.gender = 'Male';
    }
    
    // Set default country if not provided
    if (!body.country) {
      body.country = 'India';
    }
  }
  
  next();
};
