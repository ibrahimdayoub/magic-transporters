import mongoose, { Document, Schema } from 'mongoose';

interface IMagicItem {
    id: number;
    weight: number;
}

interface IMagicMover extends Document {
    id: number;
    name: string;
    weightLimit: number;
    energy: number;
    state: 'resting' | 'loading' | 'on a mission' | 'done';
    missionsCompleted: number;
    currentItems: IMagicItem[];
}

const MagicMoverSchema: Schema = new Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    weightLimit: { type: Number, required: true },
    energy: { type: Number, required: true },
    state: { type: String, enum: ['resting', 'loading', 'on a mission', 'done'], default: 'resting' },
    missionsCompleted: { type: Number, default: 0 },
    currentItems: [{ id: { type: Number, required: true }, weight: { type: Number, required: true } }]
});

const MagicMover = mongoose.model<IMagicMover>('MagicMover', MagicMoverSchema);
export default MagicMover;