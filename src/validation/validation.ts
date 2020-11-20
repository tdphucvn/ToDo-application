import Joi from 'joi';
// import {IUser} from '../types/user';


const registerValidation = (data: any) => {
    const schema = Joi.object({
        username: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(8).required()
    });
    return schema.validate(data)
};

const loginValidation = (data: any) => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(8).required()
    });
    return schema.validate(data)
};

export {registerValidation};
export {loginValidation};
