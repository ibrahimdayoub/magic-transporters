import { Request, Response } from 'express';
import ActivityLog from '../models/activityLog';

// Get Activities Log
export const getActivitiesLog = async (req: Request, res: Response): Promise<void> => {
    try {
        const activitesLog = await ActivityLog.find();
        res.status(200).json({ activitesLog, message: 'Activites log fetched successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};