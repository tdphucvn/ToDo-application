//Loading .env file just in developer enviroment
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config({path: '.env'});
};

//import expressjs
import express, {Application, Request, Response, NextFunction} from 'express';
import expressLayouts from 'express-ejs-layouts';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';

const app: Application = express();

// import {router as indexRouter} from './routes/index';

import indexRouter = require('./routes/index');
import loginRouter = require('./routes/login/login');
import registerRouter = require('./routes/register/register');

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


//Middleware routes
app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);



try{
    if(process.env.DB_CONNECTION == undefined){
        console.log('uri is undefined');
    }else{
        mongoose.connect(process.env.DB_CONNECTION, {useUnifiedTopology: true , useNewUrlParser: true}, () => console.log('Success Connection'));
    }
}catch (err){
    console.log('Access denied');
};

app.listen(process.env.PORT || 5000);