import express, {Application, Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import {userInfoValidation} from '../../validation/validation';
import {IUserInfo} from '../../types/userInfo';
import User from '../../model/User';
import UserInfo from '../../model/UserInfo';
import { Document } from 'mongoose';


const router = express.Router();

const authenticateToken = (req: Request | any, res: Response, next: NextFunction): void => {
    const accessToken: string = req.cookies.authorization;
    const accessTokenSecret: string = `${process.env.ACCESS_TOKEN_SECRET}`;
    try{
        const decoded = jwt.verify(accessToken, accessTokenSecret);
        req.user = decoded;
    } catch {
        try {
            const refreshToken: string = req.cookies.refreshToken;
            const refreshSecretToken: string = `${process.env.REFRESH_TOKEN_SECRET}`;
            if (refreshToken == null){
                res.sendStatus(401)
                return
            }
            jwt.verify(refreshToken, refreshSecretToken, (err, user: any) => {
              if (err) return res.sendStatus(403)
              const newAccessToken: string = jwt.sign({user}, accessTokenSecret, {expiresIn: '10s'});
              res.cookie('authorization', newAccessToken, {httpOnly: true});
              req.user = user;
            });
        } catch (err){
            console.log(err)
            res.sendStatus(403);
        };
    };
    next();
};

router.use(authenticateToken);

router.get('/', async (req: Request | any, res: Response) => {
    const user = req.user;
    let id;
    if(user !== undefined){
        if(user._id !== undefined){
            if(user.user!== undefined && user.user._id !== undefined){
                id = user.user._id;
                console.log(user);
            }else{
                id = user.user.user._id;
                console.log('id not found');
                console.log(user);
            }
        } else{
            id = user._id;
            console.log(user);
        }    
    }

    const userInfo = await UserInfo.findOne({user: id});
    const userInfoObject = {
        First_Name: userInfo?.fname,
        Last_Name: userInfo?.lname,
        Birthday: userInfo?.bday,
        Street: userInfo?.street,
        City: userInfo?.city,
        Postal_Code: userInfo?.pcode
    }
    console.log(userInfoObject);
    res.render('private/index', {object: userInfoObject});
});

router.get('/personal', async (req: Request, res: Response) => {
    res.render('private/personal');
});

router.post('/personal/edit', async (req: Request | any, res: Response) => {
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


export {router};
