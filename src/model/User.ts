import mongoose, { Schema, model} from 'mongoose';
import { IUser } from '../types/user';


const userSchema: Schema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    }, 
    email: {
        type: String,
        min: 6,
        max: 255,
        require: true
    },
    password: {
        type: String,
        min: 8,
        max: 1024,
        require: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

export default model<IUser>('user', userSchema); 