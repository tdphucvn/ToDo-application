import express, {Application, Request, Response, NextFunction} from 'express';
import mongoose, { Mongoose } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {IUser} from '../../types/user';
import User from '../../model/User';
import {loginValidation} from '../../validation/validation';

const router = express.Router();

router.get('/', (req, res) => {
    res.render('user/login');
});

router.post('/request', async (req, res) => {
    try {
        const body = req.body as Pick<IUser, "username" | "password">;
        console.log('picked')
        const {error} = loginValidation(req.body);
        if(error){
            res.status(400);
            throw error;
        };
        console.log('validatebody')
        const user: IUser | null = await User.findOne({username: body.username});
        if (user == null){
            res.status(400);
            throw error;
        };
        console.log('userfound')
        const validPassword = await bcrypt.compare(body.password, user.password);
        if (!validPassword){
            res.status(400);
            throw error;
        }
        console.log('validpass')
        const secretToken: string = `${process.env.ACCESS_TOKEN_SECRET}`;
        const token: string = jwt.sign({ user }, secretToken);
        res.cookie('authorization', token, {httpOnly: true, expires: new Date(Date.now() + 5000)});
        res.redirect('../private');
    } catch (err){
        console.log(err);
        res.redirect('/');
    };
});

export {router};