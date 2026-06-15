import { Request, Response } from 'express';
import NewsletterModel from '../../models/newsletter.model';

export const subscribeNewsletter = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    // Check if email already exists
    const existing = await NewsletterModel.findOne({ where: { email } });
    if (existing) {
      // If they were unsubscribed, reactivate them
      if (existing.status === 'unsubscribed') {
        existing.status = 'active';
        await existing.save();
        return res.json({ success: true, message: 'Successfully resubscribed to the newsletter.', data: existing });
      }
      return res.status(400).json({ success: false, message: 'Email is already subscribed.' });
    }

    const newLead = await NewsletterModel.create({ email, status: 'active' });
    return res.json({ success: true, message: 'Successfully subscribed to the newsletter.', data: newLead });
  } catch (error) {
    console.error('Newsletter Subscription Error:', error);
    return res.status(500).json({ success: false, message: 'An error occurred while subscribing.' });
  }
};

export const getNewsletterLeads = async (req: Request, res: Response) => {
  try {
    const leads = await NewsletterModel.findAll({
      order: [['created_at', 'DESC']],
    });
    return res.json({ success: true, data: leads });
  } catch (error) {
    console.error('Fetch Newsletter Leads Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch newsletter leads.' });
  }
};

export const unsubscribeNewsletter = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const lead = await NewsletterModel.findByPk(id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found.' });
    }
    lead.status = 'unsubscribed';
    await lead.save();
    return res.json({ success: true, message: 'Unsubscribed successfully.', data: lead });
  } catch (error) {
    console.error('Unsubscribe Newsletter Error:', error);
    return res.status(500).json({ success: false, message: 'An error occurred.' });
  }
};
