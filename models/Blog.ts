import mongoose, { Schema, Document } from 'mongoose';

export interface IBlogPost extends Document {
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  slug: string;
  date: string; // ISO string
  author?: mongoose.Types.ObjectId;
  tags?: string[];
  category?: string;
  published: boolean;
  views: number;
}

const BlogSchema = new Schema<IBlogPost>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      minlength: [3, 'Title must be at least 10 characters'],
    },
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required'],
      minlength: [10, 'Excerpt must be at least 10 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      minlength: [20, 'Content must be at least 20 characters'],
    },
    imageUrl: {
      type: String,
      required: [true, 'Blog Cover Image Is Required'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    tags: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
    },
    published: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const BlogModel =
  mongoose.models.Blog || mongoose.model<IBlogPost>('Blog', BlogSchema);
