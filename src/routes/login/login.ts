import express, {Application, Request, Response, NextFunction} from 'express';
import mongoose from 'mongoose';
const router = express.Router();

router.get('/', (req, res) => {
    res.render('logins/index');
});

export = router;