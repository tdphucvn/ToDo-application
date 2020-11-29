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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../../../model/User"));
const validation_1 = require("../../../validation/validation");
const router = express_1.default.Router();
exports.router = router;
router.get('/', (req, res) => {
    res.render('user/login');
});
router.post('/request', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const { error } = validation_1.loginValidation(req.body);
        if (error) {
            res.status(400);
            throw error;
        }
        ;
        const user = yield User_1.default.findOne({ username: body.username });
        if (user == null) {
            res.status(400);
            throw error;
        }
        ;
        const validPassword = yield bcrypt_1.default.compare(body.password, user.password);
        if (!validPassword) {
            res.status(400);
            throw error;
        }
        const accessSecretToken = `${process.env.ACCESS_TOKEN_SECRET}`;
        const refreshSecretToken = `${process.env.REFRESH_TOKEN_SECRET}`;
        const accessToken = jsonwebtoken_1.default.sign({ user }, accessSecretToken, { expiresIn: '10s' });
        const refreshToken = jsonwebtoken_1.default.sign({ user }, refreshSecretToken, { expiresIn: '1day' });
        res.cookie('authorization', accessToken, { httpOnly: true });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 86400000 });
        res.redirect('../private');
    }
    catch (err) {
        res.redirect('/login');
    }
    ;
}));
