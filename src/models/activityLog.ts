import mongoose, { Document, Schema } from 'mongoose';

interface IMagicItem {
    id: number;
}

interface IActivityLog extends Document {
    id: number;
    date: Date;
    moverId: number;
    state: 'resting' | 'loading' | 'on a mission' | 'done';
    magicItems: IMagicItem[];
}

const ActivityLogSchema: Schema = new Schema({
    id: { type: Number, required: true },
    date: { type: Date, required: true },
    moverId: { type: Number, required: true },
    state: { type: String, enum: ['resting', 'loading', 'on a mission', 'done'], default: 'resting' },
    magicItems: [{ id: { type: Number, required: true } }]
});

const ActivityLog = mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
export default ActivityLog;