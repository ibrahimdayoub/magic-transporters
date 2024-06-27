import { Request, Response } from 'express';
import { addMagicItemValidator } from '../validations/magicItemValidation';
import MagicItem from '../models/magicItem';

// Add Magic Item
export const addMagicItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, weight } = req.body;

        const validation = addMagicItemValidator({ name, weight });

        if (validation.fails()) {
            res.status(400).json({ errors: validation.errors.all(), message: "Some fields are required or not validated" });
            return;
        }

        const newItem = new MagicItem({
            id: await MagicItem.countDocuments() + 1,
            name,
            weight
        });

        await newItem.save();
        res.status(201).json({ newItem, message: 'Item added successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};