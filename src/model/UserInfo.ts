import mongoose, { Schema, model} from 'mongoose';
import { IUserInfo } from '../types/userInfo';


const userInfoSchema: Schema = new mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    bday: {
        type: Date,
        required: true
    },
    street: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    pcode: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    }
});

export default model<IUserInfo>('user_info', userInfoSchema); 