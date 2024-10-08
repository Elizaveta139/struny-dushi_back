import { model, Schema } from 'mongoose';

import { handleMongooseError } from '../helpers/handleMongooseError.js';
import { enumValue, emailRegexp } from '../helpers/schemeSettings.js';

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      math: emailRegexp,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    subscription: {
      type: String,
      enum: enumValue,
      default: 'user',
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, 'Verify token is required'],
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: String,
  },
  { versionKey: false, timestamps: true }
);

userSchema.post('save', handleMongooseError);

export const User = model('user', userSchema);
