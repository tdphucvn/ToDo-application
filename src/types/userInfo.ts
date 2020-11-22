import mongoose from 'mongoose';

export interface IUserInfo extends mongoose.Document{
    fname: string;
    lname: string;
    bday: Date;
    street: string;
    city: string;
    pcode: number;
}