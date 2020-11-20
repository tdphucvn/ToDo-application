import express, {Application, Request, Response, NextFunction} from 'express';
import { Document } from 'mongoose';
import User = require('../../model/User');
const router = express.Router();


router.get('/', (req: Request, res: Response) => {
    res.render('registers/index');
});

router.post('/create', async (req: Request, res: Response) => {
    const user:Document = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });

    try{
        const newUser = await user.save();
        res.redirect(`register/${newUser.id}`);
    } catch (err) {
        console.log(err)
        res.render('registers/index');
    };
});

export =  router;