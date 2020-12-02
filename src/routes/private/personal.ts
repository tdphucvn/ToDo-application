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
        fname: userInfo?.fname,
        lname: userInfo?.lname,
        bday: userInfo?.bday,
        street: userInfo?.street,
        city: userInfo?.city,
        pcode: userInfo?.pcode
    }
    res.render('private/personal', {userInfoObject : userInfoObject});
});

router.post('/edit', async (req: Request | any, res: Response) => {
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
        if(req.user.user == undefined){
            user = req.user;
        }else{
            if(req.user.user !== undefined){
                user = req.user.user;
            } else{
                user = req.user.user.user
            }
        };
        console.log(user);
        const userInfo: Document = new UserInfo({
            fname: body.fname,
            lname: body.lname,
            bday: body.bday,
            street: body.street,
            city: body.city, 
            pcode: body.pcode,
            user: user
        })
        const newUserInfo = await userInfo.save();
        res.redirect('/private');
    } catch (err){
        console.log(err);
        res.redirect('/private/personal');
    };
});



export{ router }