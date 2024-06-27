import { Request, Response } from 'express';
import { addMagicMoverValidator, loadMagicMoverValidator } from '../validations/magicMoverValidation';
import MagicMover from '../models/magicMover';
import MagicItem from '../models/magicItem';
import ActivityLog from '../models/activityLog';

// Add Magic Mover
export const addMagicMover = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, weightLimit, energy } = req.body;

        const validation = addMagicMoverValidator({ name, weightLimit, energy });

        if (validation.fails()) {
            res.status(400).json({ errors: validation.errors.all(), message: "Some fields are required or not validated" });
            return;
        }

        const newMover = new MagicMover({
            id: await MagicMover.countDocuments() + 1,
            name,
            weightLimit,
            energy
        });

        await newMover.save();
        res.status(201).json({ newMover, message: 'Mover added successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Load Magic Mover
export const loadMagicMover = async (req: Request, res: Response): Promise<void> => {
    try {
        const moverId = parseInt(req.params.id);
        const { items } = req.body;

        const validation = loadMagicMoverValidator({ moverId, items });

        if (validation.fails()) {
            res.status(400).json({ errors: validation.errors.all() });
            return;
        }

        const mover = await MagicMover.findOne({ id: moverId });
        if (!mover) {
            res.status(404).json({ message: 'Magic mover not found' });
            return;
        }

        if (mover.state !== 'resting' && mover.state !== 'loading' && mover.state !== 'done') {
            res.status(400).json({ message: 'Cannot load items in current state' });
            return;
        }

        const currentItems = mover.currentItems;
        let currentWeights = currentItems.reduce((acc, currentItem) => acc + currentItem.weight, 0);

        for (const itemId of items) {
            const item = await MagicItem.findOne({ id: itemId });
            if (item) {
                const isItemLoaded: boolean = currentItems.some((loadedItem) => loadedItem.id === item.id);

                if (!isItemLoaded) {
                    if (item.weight + currentWeights > mover.weightLimit) {
                        res.status(400).json({ message: 'Exceeds weight limit' });
                        return;
                    }

                    if (item.weight > mover.energy) {
                        res.status(400).json({ message: 'Exceeds energy limit' });
                        return;
                    }

                    currentWeights += item.weight;
                    mover.energy -= item.weight;
                    currentItems.push({ id: item.id, weight: item.weight });
                }
            }
        }
        
        mover.currentItems = currentItems;
        mover.state = 'loading';
        await mover.save();

        await logActivity(mover);

        res.status(200).json({ mover, message: 'Items loaded successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Start Mission
export const startMission = async (req: Request, res: Response): Promise<void> => {
    try {
        const moverId = parseInt(req.params.id);
        const mover = await MagicMover.findOne({ id: moverId });

        if (!mover) {
            res.status(404).json({ message: 'Magic mover not found' });
            return;
        }

        if (mover.state !== 'loading') {
            res.status(400).json({ message: 'Cannot start mission in current state' });
            return;
        }

        mover.state = 'on a mission';
        await mover.save();

        await logActivity(mover);

        res.status(200).json({ mover, message: 'Mission started successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// End Mission
export const endMission = async (req: Request, res: Response): Promise<void> => {
    try {
        const moverId = parseInt(req.params.id);
        const mover = await MagicMover.findOne({ id: moverId });

        if (!mover) {
            res.status(404).json({ message: 'Magic mover not found' });
            return;
        }

        if (mover.state !== 'on a mission') {
            res.status(400).json({ message: 'Cannot end mission in current state' });
            return;
        }

        mover.state = 'done';
        mover.missionsCompleted += 1;
        mover.currentItems = [];
        await mover.save();

        await logActivity(mover);

        res.status(200).json({ mover, message: 'Mission completed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get Top Movers
export const getTopMovers = async (req: Request, res: Response): Promise<void> => {
    try {
        const sortedMovers = await MagicMover.find().sort({ missionsCompleted: -1 });
        res.status(200).json({ sortedMovers, message: 'Movers fetched successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Helper

// Log Activity
const logActivity = async (mover: any) => {
    const activityLog = new ActivityLog({
        id: await ActivityLog.countDocuments() + 1,
        date: new Date(),
        moverId: mover.id,
        state: mover.state,
        magicItems: mover.currentItems.map((item: any) => ({ id: item.id }))
    });
    await activityLog.save();
};