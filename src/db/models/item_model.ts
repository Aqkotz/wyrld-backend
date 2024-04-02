import mongoose, { Schema } from 'mongoose';

export interface IItem {
  _id: mongoose.Schema.Types.ObjectId;
  resourceId: mongoose.Schema.Types.ObjectId;
  name: string;
  description: string;
}

export const ItemSchema = new Schema<IItem>({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  resourceId: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, { __v, ...item }) => item,
  },
});

const ItemModel = mongoose.model<IItem>('Item', ItemSchema);

export default ItemModel;