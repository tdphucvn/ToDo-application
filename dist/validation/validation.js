"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userInfoValidation = exports.loginValidation = exports.registerValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const registerValidation = (data) => {
    const schema = joi_1.default.object({
        username: joi_1.default.string().min(3).required(),
        email: joi_1.default.string().min(6).required().email(),
        password: joi_1.default.string().min(8).required()
    });
    return schema.validate(data);
};
exports.registerValidation = registerValidation;
const loginValidation = (data) => {
    const schema = joi_1.default.object({
        username: joi_1.default.string().min(6).required(),
        password: joi_1.default.string().min(8).required()
    });
    return schema.validate(data);
};
exports.loginValidation = loginValidation;
const userInfoValidation = (data) => {
    const schema = joi_1.default.object({
        fname: joi_1.default.string().required(),
        lname: joi_1.default.string().required(),
        bday: joi_1.default.date().required(),
        street: joi_1.default.string().min(2).required(),
        city: joi_1.default.string().min(2).required(),
        pcode: joi_1.default.number().min(5).required(),
    });
    return schema.validate(data);
};
exports.userInfoValidation = userInfoValidation;
