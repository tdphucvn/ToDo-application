import express, {Application, Request, Response, NextFunction} from 'express';
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index');
});

export {router};