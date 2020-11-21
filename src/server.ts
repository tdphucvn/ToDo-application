//Loading .env file just in developer enviroment
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config({path: '.env'});
};

//Port
const PORT: string | number = process.env.PORT || 4000;

//import expressjs
import express, {Application, Request, Response, NextFunction} from 'express';
import expressLayouts from 'express-ejs-layouts';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';


//creating application
const app: Application = express();

// import {router as indexRouter} from './routes/index';

import {router as indexRouter} from './routes/index';
import {router as loginRouter} from './routes/user/login';
import {router as registerRouter} from './routes/user/register';
import {router as privateRouter} from './routes/privates/indexPrivate';


//Using EJS as view engine
app.set('view engine', 'ejs');
//directory where the template files are located
app.set('views', __dirname + '/../views');
//setting the default view
app.set('layout', __dirname + '/../views/layouts/layout');
app.use(expressLayouts);
app.use(methodOverride('_method'));
//Public files CSS/JS
app.use(express.static('public'));
//Parsing to JSON data
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}));
app.use(cookieParser());



//Middleware routes
app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/private', privateRouter);

const uri: string = `${process.env.DB_CONNECTION}`;
const options = { useUnifiedTopology: true , useNewUrlParser: true };
mongoose.set("useFindAndModify", false)


mongoose.connect(uri, options).then(() => {
    app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
}).catch (err => {
    console.log('Access denied');
    console.log(err);
    throw err;
});