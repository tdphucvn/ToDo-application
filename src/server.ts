import express, {Application, Request, Response, NextFunction} from 'express';

const app: Application = express();

const add = (a: number, b: number): number => a+b;

app.get('/', (req: Request, res: Response) => {
    console.log(add(4, 9));
    res.send('Hello World');
});

app.listen(5000, () => console.log('Server running'));