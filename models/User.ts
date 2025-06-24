import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required!'],
    unique: true,
    minlength: [4, 'Username too short, minimum 4 characters required!'],
    maxlength: [24, 'Username too long, maximum 24 characters allowed!'],
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required!'],
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'Invalid email address!'],
    sparse: true
  },
  bio: {
    type: String,
    required:false,
    maxlength: [1000, 'Bio cannot exceed 1000 characters!'],
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  avatarUrl: {
    type: String,
    default: '/person-with-blue-shirt-that-says-name-person_1029948-7040 (1).avif',
    trim: true
  }
}, {
  timestamps: true
});

export const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
