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
const UserInfo_1 = __importDefault(require("../../model/UserInfo"));
const router = express_1.default.Router();
exports.router = router;
const authenticateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = req.cookies.authorization;
    const accessTokenSecret = `${process.env.ACCESS_TOKEN_SECRET}`;
    try {
        const decoded = yield jsonwebtoken_1.default.verify(accessToken, accessTokenSecret);
        req.user = decoded;
    }
    catch (_a) {
        try {
            const refreshToken = req.cookies.refreshToken;
            const refreshSecretToken = `${process.env.REFRESH_TOKEN_SECRET}`;
            if (refreshToken == null) {
                res.redirect('/login');
                return;
            }
            jsonwebtoken_1.default.verify(refreshToken, refreshSecretToken, (err, user) => {
                if (err)
                    return res.redirect('/login');
                const newAccessToken = jsonwebtoken_1.default.sign({ user }, accessTokenSecret, { expiresIn: '10s' });
                res.cookie('authorization', newAccessToken, { httpOnly: true });
                req.user = user;
            });
        }
        catch (err) {
            console.log(err);
            res.sendStatus(403);
        }
        ;
    }
    ;
    next();
});
router.use(authenticateToken);
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    let id;
    if (user !== undefined) {
        if (user._id !== undefined) {
            id = user._id;
            console.log(user, 'third case', id);
        }
        else {
            if (user.user !== undefined && user.user._id !== undefined) {
                id = user.user._id;
                console.log(user, 'first case', id);
            }
            else {
                id = user.user.user._id;
                console.log(user, 'second case', id);
            }
        }
    }
    const userInfo = yield UserInfo_1.default.findOne({ user: id });
    const userInfoObject = {
        First_Name: userInfo === null || userInfo === void 0 ? void 0 : userInfo.fname,
        Last_Name: userInfo === null || userInfo === void 0 ? void 0 : userInfo.lname,
        Birthday: userInfo === null || userInfo === void 0 ? void 0 : userInfo.bday,
        Street: userInfo === null || userInfo === void 0 ? void 0 : userInfo.street,
        City: userInfo === null || userInfo === void 0 ? void 0 : userInfo.city,
        Postal_Code: userInfo === null || userInfo === void 0 ? void 0 : userInfo.pcode
    };
    console.log(userInfoObject);
    res.render('private/index', { object: userInfoObject });
}));
router.delete('/logout', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie('authorization');
    res.clearCookie('refreshToken');
    res.redirect('../login');
}));
