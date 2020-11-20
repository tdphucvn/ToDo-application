import mongoose from 'mongoose';
interface IUser {
    username: string;
    email: string;
    password: string;
}

// interface userModelInterface extends mongoose.Model<any> {
//     build(attr: IUser): any;
// };

const userSchema = new mongoose.Schema({
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

const User = mongoose.model('user', userSchema);
// const User = mongoose.model<any, userModelInterface>('user', userSchema);

// User.build({
//     username: 'some username',
//     email: 'some email',
//     password: 'some password'
// });

export = User;