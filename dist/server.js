"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: '.env' });
}
;
const express_1 = __importDefault(require("express"));
const express_ejs_layouts_1 = __importDefault(require("express-ejs-layouts"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const method_override_1 = __importDefault(require("method-override"));
const app = express_1.default();
const indexRouter = require("./routes/index");
const loginRouter = require("./routes/login/login");
const registerRouter = require("./routes/register/register");
app.set('view engine', 'ejs');
app.set('views', __dirname + '/../views');
app.set('layout', __dirname + '/../views/layouts/layout');
app.use(express_ejs_layouts_1.default);
app.use(method_override_1.default('_method'));
app.use(express_1.default.static('public'));
app.use(body_parser_1.default.urlencoded({ limit: '10mb', extended: false }));
app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
try {
    if (process.env.DB_CONNECTION == undefined) {
        console.log('uri is undefined');
    }
    else {
        mongoose_1.default.connect(process.env.DB_CONNECTION, { useUnifiedTopology: true, useNewUrlParser: true }, () => console.log('Success Connection'));
    }
}
catch (err) {
    console.log('Access denied');
}
;
app.listen(process.env.PORT || 5000);
