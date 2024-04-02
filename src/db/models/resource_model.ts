import mongoose, { Schema } from 'mongoose';

export interface IResource {
  id: string;
  title: string;
  description: string;
  value: number;
}

export const ResourceSchema = new Schema<IResource>({
  id: { type: String, required: true, unique: true },
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
