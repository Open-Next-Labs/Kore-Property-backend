import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  email: {
    type: String,
    required: false,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  middleName: {
    type: String,
  },
  avatar: {
    type: String,
    default: null,
  },
  phone: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  resetToken: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
});

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
