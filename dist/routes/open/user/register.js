"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../../../model/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const validation_1 = require("../../../validation/validation");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
exports.router = router;
const saltRounds = 10;
router.get('/', (req, res) => {
    res.render('user/register');
});
router.post('/create', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const { error } = validation_1.registerValidation(req.body);
        if (error) {
            res.status(400);
            throw error;
        }
        const usernameExist = yield User_1.default.findOne({ username: body.username });
        if (usernameExist) {
            res.status(400);
            throw error;
        }
        const emailExists = yield User_1.default.findOne({ email: body.email });
        if (emailExists) {
            res.status(400);
            throw error;
        }
        const salt = yield bcrypt_1.default.genSalt(saltRounds);
        const hashedPassword = yield bcrypt_1.default.hash(body.password, salt);
        const user = new User_1.default({
            username: body.username,
            email: body.email,
            password: hashedPassword
        });
        const newUser = yield user.save();
        console.log(newUser);
        const accessSecretToken = `${process.env.ACCESS_TOKEN_SECRET}`;
        const refreshSecretToken = `${process.env.REFRESH_TOKEN_SECRET}`;
        const accessToken = jsonwebtoken_1.default.sign({ user: newUser }, accessSecretToken, { expiresIn: '10s' });
        const refreshToken = jsonwebtoken_1.default.sign({ user: newUser }, refreshSecretToken, { expiresIn: '1day' });
        res.cookie('authorization', accessToken, { httpOnly: true });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, expires: new Date(86400000) });
        res.redirect(`../private/personal`);
    }
    catch (err) {
        console.log(err);
        res.redirect('/register');
    }
    ;
}));
