"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: '.env' });
}
;
const PORT = process.env.PORT || 3000;
const express_1 = __importDefault(require("express"));
const express_ejs_layouts_1 = __importDefault(require("express-ejs-layouts"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const method_override_1 = __importDefault(require("method-override"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = express_1.default();
const index_1 = require("./routes/open/index");
const login_1 = require("./routes/open/user/login");
const register_1 = require("./routes/open/user/register");
const indexPrivate_1 = require("./routes/private/indexPrivate");
const personal_1 = require("./routes/private/personal");
app.set('view engine', 'ejs');
app.set('views', __dirname + '/../views');
app.set('layout', __dirname + '/../views/layouts/layout');
app.use(express_ejs_layouts_1.default);
app.use(method_override_1.default('_method'));
app.use(express_1.default.static('public'));
app.use(body_parser_1.default.urlencoded({ limit: '10mb', extended: false }));
app.use(cookie_parser_1.default());
app.use('/', index_1.router);
app.use('/login', login_1.router);
app.use('/register', register_1.router);
app.use('/private', indexPrivate_1.router);
app.use('/private/personal', personal_1.router);
const uri = `${process.env.DB_CONNECTION}`;
const options = { useUnifiedTopology: true, useNewUrlParser: true };
mongoose_1.default.set("useFindAndModify", false);
mongoose_1.default.connect(uri, options).then(() => {
    app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
}).catch(err => {
    console.log('Access denied');
    console.log(err);
    throw err;
});
