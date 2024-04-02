import mongoose, { Schema } from 'mongoose';

export interface IResource {
  _id: mongoose.Schema.Types.ObjectId;
  title: string;
  description: string;
  value: number;
}

export const ResourceSchema = new Schema<IResource>({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  value: { type: Number, required: true },
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, { __v, ...resource }) => resource,
  },
});

const ResourceModel = mongoose.model<IResource>('Resource', ResourceSchema);

export default ResourceModel;
