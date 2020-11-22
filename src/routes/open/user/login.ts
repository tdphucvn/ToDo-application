import express, {Application, Request, Response, NextFunction} from 'express';
import mongoose, { Mongoose } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {IUser} from '../../../types/user';
import User from '../../../model/User';
import {loginValidation} from '../../../validation/validation';

const router = express.Router();

router.get('/', (req, res) => {
    res.render('user/login');
});

router.post('/request', async (req, res) => {
    try {
        const body = req.body as Pick<IUser, "username" | "password">;
        const {error} = loginValidation(req.body);
        if(error){
            res.status(400);
            throw error;
        };
        const user: IUser | null = await User.findOne({username: body.username});
        if (user == null){
            res.status(400);
            throw error;
        };
        const validPassword = await bcrypt.compare(body.password, user.password);
        if (!validPassword){
            res.status(400);
            throw error;
        }
        const accessSecretToken: string = `${process.env.ACCESS_TOKEN_SECRET}`;
        const refreshSecretToken: string = `${process.env.REFRESH_TOKEN_SECRET}`;
        const accessToken: string = jwt.sign({ user }, accessSecretToken, {expiresIn: '10s'});
        const refreshToken: string = jwt.sign({ user }, refreshSecretToken);
        res.cookie('authorization', accessToken, {httpOnly: true});
        res.cookie('refreshToken', refreshToken, {httpOnly: true});
        res.redirect('../private');
    } catch (err){
        res.redirect('/login');
    };
});

export {router};