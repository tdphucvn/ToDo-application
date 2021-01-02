import express, {Application, Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import {userInfoValidation} from '../../validation/validation';
import {IUserInfo} from '../../types/userInfo';
import User from '../../model/User';
import UserInfo from '../../model/UserInfo';
import { Document } from 'mongoose';

const router = express.Router();

router.get('/', async (req: Request | any, res: Response) => {
    const user = req.user;
    let id;
    if(user !== undefined){
        if(user._id !== undefined){
            id = user._id;
            console.log(user, 'third case', id);
        } else {
            if(user.user !== undefined && user.user._id !== undefined){
                id = user.user._id;
                console.log(user, 'first case', id);
            }else{
                id = user.user.user._id;
                console.log(user, 'second case', id);
            };
        };
    };

    const userInfo = await UserInfo.findOne({user: id});
    const userInfoObject = {
        userID: id,
        fname: userInfo?.fname,
        lname: userInfo?.lname,
        bday: userInfo?.bday,
        street: userInfo?.street,
        city: userInfo?.city,
        pcode: userInfo?.pcode
    }
    res.render('private/personal', {userInfoObject : userInfoObject});
});

router.post('/:id', async (req: Request | any, res: Response) => {
    try {
        const accessToken: string = req.cookies.authorization;
        const accessTokenSecret: string = `${process.env.ACCESS_TOKEN_SECRET}`;
        let user;
        try {
            const decoded = jwt.verify(accessToken, accessTokenSecret);
            req.user = decoded;
        } catch (err){
            console.log('Unauthorized');
        };
        const body = req.body as Pick<IUserInfo, "fname" | "lname" | "bday" | "street" | "city" | "pcode">;
        const {error} = userInfoValidation(req.body);
        if(error){
            res.status(400);
            throw error;
        };
        const USER = await User.findById(req.params.id);
        console.log(user);
        const userInfo: Document = new UserInfo({
            fname: body.fname,
            lname: body.lname,
            bday: body.bday,
            street: body.street,
            city: body.city, 
            pcode: body.pcode,
            user: USER
        })
        const newUserInfo = await userInfo.save();
        res.redirect('/private');
    } catch (err){
        console.log(err);
        res.redirect('/private/personal');
    };
});

router.put('/:id', async (req: Request | any, res: Response) => {
    try {
        const accessToken: string = req.cookies.authorization;
        const accessTokenSecret: string = `${process.env.ACCESS_TOKEN_SECRET}`;
        try {
            const decoded = jwt.verify(accessToken, accessTokenSecret);
            req.user = decoded;
        } catch (err){
            console.log('Unauthorized');
        };
        const body = req.body as Pick<IUserInfo, "fname" | "lname" | "bday" | "street" | "city" | "pcode">;
        const {error} = userInfoValidation(req.body);
        if(error){
            console.log(error);
            res.status(400);
            throw error;
        };
        const USER = await UserInfo.findOne({user : req.params.id});
        if (USER == null){
            res.status(400);
            throw error;
        } else {
            USER.fname = body.fname;
            USER.lname = body.lname;
            USER.bday = body.bday;
            USER.street = body.street;
            USER.city = body.city;
            USER.pcode = body.pcode;
        }
        const userSaved = await USER.save();        
        res.redirect('/private');
    } catch (err){
        console.log(err);
        res.redirect('/private/personal');
    };
});

export{ router }