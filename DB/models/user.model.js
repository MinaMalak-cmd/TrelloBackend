import { Schema, model } from "mongoose";

const userSchema = new Schema({
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
  confirmEmail : {
    type : Boolean, 
    default: false,
  },
  phone: String,
  isDeleted: {
    type : Boolean, 
    default: false,
  }
}, {
  timestamps:true
});

const userModel = model('User', userSchema);

export default userModel;

