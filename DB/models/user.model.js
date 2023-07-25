import { Schema, model } from "mongoose";

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: String,
  bio: String,
  userName: {
    type: String,
    required: true,
  },
  email: {
    unique: true,
    type: String,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  age : Number,
  gender:{
    type: String,
    default: 'male',
    enum: ['male', 'female'],
  },
  status:{
    type: String,
    default: 'offline',
    enum: ['offline', 'online', 'away'],
  },
  confirmEmail : {
    type : Boolean, 
    default: false,
  },
  phone: String,
  profileImage: String,
  coverImages: [String]
}, {
  timestamps:true
});

const userModel = model('User', userSchema);

export default userModel;

