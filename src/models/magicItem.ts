import mongoose, { Document, Schema } from 'mongoose';

interface IMagicItem extends Document {
    id: number;
    name: string;
    weight: number;
}

const MagicItemSchema: Schema = new Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    weight: { type: Number, required: true }
});

const MagicItem = mongoose.model<IMagicItem>('MagicItem', MagicItemSchema);
export default MagicItem;