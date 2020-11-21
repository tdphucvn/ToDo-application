import express, {Application, Request, Response, NextFunction} from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';


const router = express.Router();


router.get('/', (req, res) => {
    const token: string = req.cookies.authorization;
    const secretToken: string = `${process.env.ACCESS_TOKEN_SECRET}`; 
    try { 
        const decoded = jwt.verify(token, secretToken)
        res.send('Authenticated');    
    } catch (err){
        res.sendStatus(403); 
    };
});

export {router};