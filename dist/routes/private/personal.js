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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validation_1 = require("../../validation/validation");
const UserInfo_1 = __importDefault(require("../../model/UserInfo"));
const router = express_1.default.Router();
exports.router = router;
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render('private/personal');
}));
router.post('/edit', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = req.cookies.authorization;
        const accessTokenSecret = `${process.env.ACCESS_TOKEN_SECRET}`;
        let user;
        try {
            const decoded = jsonwebtoken_1.default.verify(accessToken, accessTokenSecret);
            req.user = decoded;
        }
        catch (err) {
            console.log('Unauthorized');
        }
        ;
        const body = req.body;
        const { error } = validation_1.userInfoValidation(req.body);
        if (error) {
            res.status(400);
            throw error;
        }
        ;
        if (req.user.user == undefined) {
            user = req.user;
        }
        else {
            if (req.user.user !== undefined) {
                user = req.user.user;
            }
            else {
                user = req.user.user.user;
            }
        }
        ;
        console.log(user);
        const userInfo = new UserInfo_1.default({
            fname: body.fname,
            lname: body.lname,
            bday: body.bday,
            street: body.street,
            city: body.city,
            pcode: body.pcode,
            user: user
        });
        const newUserInfo = yield userInfo.save();
        res.redirect('/private');
    }
    catch (err) {
        console.log(err);
        res.redirect('/private/personal');
    }
    ;
}));
