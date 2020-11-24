import Joi from 'joi';
// import {IUser} from '../types/user';

const registerValidation = (data: object) => {
    const schema: Joi.ObjectSchema = Joi.object({
        username: Joi.string().min(3).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(8).required()
    });
    return schema.validate(data)
};

const loginValidation = (data: object) => {
    const schema: Joi.ObjectSchema  = Joi.object({
        username: Joi.string().min(6).required(),
        password: Joi.string().min(8).required()
    });
    return schema.validate(data)
};

const userInfoValidation = (data: object) => {
    const schema: Joi.ObjectSchema  = Joi.object({
        fname: Joi.string().required(),
        lname: Joi.string().required(),
        bday: Joi.date().required(),
        street: Joi.string().min(2).required(),
        city: Joi.string().min(2).required(),
        pcode: Joi.number().min(5).required(),
    })
    return schema.validate(data);
};

export {registerValidation};
export {loginValidation};
export {userInfoValidation};
