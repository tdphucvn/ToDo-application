import express, {Application, Request, Response, NextFunction} from 'express';
import { Document } from 'mongoose';
import User from '../../../model/User';
import {IUser} from '../../../types/user';
import bcrypt from 'bcrypt';
import {registerValidation} from '../../../validation/validation';
import jwt from 'jsonwebtoken';

const router = express.Router();
const saltRounds: number = 10;

router.get('/', (req: Request, res: Response) => {
    res.render('user/register');
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
        const accessSecretToken: string = `${process.env.ACCESS_TOKEN_SECRET}`;
        const refreshSecretToken: string = `${process.env.REFRESH_TOKEN_SECRET}`;
        const accessToken: string = jwt.sign({ newUser }, accessSecretToken, {expiresIn: '10s'});
        const refreshToken: string = jwt.sign({ newUser }, refreshSecretToken);
        res.cookie('authorization', accessToken, {httpOnly: true});
        res.cookie('refreshToken', refreshToken, {httpOnly: true});
        res.redirect(`../private`);
    } catch (err) {
        console.log(err);
        res.redirect('/register'); //render new page with the information
    };
});

export {router};