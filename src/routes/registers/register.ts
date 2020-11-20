import express, {Application, Request, Response, NextFunction} from 'express';
import { Document } from 'mongoose';
import User from '../../model/User';
import {IUser} from '../../types/user';
import bcrypt from 'bcrypt';
import {registerValidation} from '../../validation/validation';
import jwt from 'jsonwebtoken';

const router = express.Router();
const saltRounds: number = 10;

router.get('/', (req: Request, res: Response) => {
    res.render('registers/index');
});

router.post('/create', async (req: Request, res: Response): Promise<void> => {
    try{
        const body = req.body as Pick<IUser, "username" | "email" | "password">;
        const {error} = registerValidation(req.body);
        if(error){
            res.status(400);
            throw error;
        }
        const usernameExist = await User.findOne({username: body.username});
        if(usernameExist){
            res.status(400);
            throw error;
        }
        const emailExists = await User.findOne({email: body.email});
        if(emailExists){
            res.status(400);
            throw error;
        }
        const salt: string = await bcrypt.genSalt(saltRounds);
        const hashedPassword: string = await bcrypt.hash(body.password, salt)
        const user:Document = new User({
            username: body.username,
            email: body.email,
            password: hashedPassword
        });
        const newUser = await user.save();
        const secretToken: string = `${process.env.TOKEN_SECRET}`;
        const token: string = jwt.sign({_id: newUser._id}, secretToken);
        res.redirect(`../private/${newUser.id}`);
        // res.header('auth-token', token).send(token);
    } catch (err) {
        res.render('registers/index');
    };
});

export {router};