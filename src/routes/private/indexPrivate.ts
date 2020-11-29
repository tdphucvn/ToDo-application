import express, {Application, Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import UserInfo from '../../model/UserInfo';


const router = express.Router();

const authenticateToken = async (req: Request | any, res: Response, next: NextFunction): Promise<void> => {
    const accessToken: string = req.cookies.authorization;
    const accessTokenSecret: string = `${process.env.ACCESS_TOKEN_SECRET}`;
    try{
        const decoded = await jwt.verify(accessToken, accessTokenSecret);
        req.user = decoded;
    } catch {
        try {
            const refreshToken: string = req.cookies.refreshToken;
            const refreshSecretToken: string = `${process.env.REFRESH_TOKEN_SECRET}`;
            if (refreshToken == null){
                res.redirect('/login');
                return
            }
            jwt.verify(refreshToken, refreshSecretToken, (err, user: any) => {
              if (err) return res.redirect('/login');
              const newAccessToken: string = jwt.sign({user}, accessTokenSecret, {expiresIn: '10s'});
              res.cookie('authorization', newAccessToken, {httpOnly: true});
              req.user = user;
            });
        } catch (err){
            console.log(err)
            res.sendStatus(403);
        };
    };
    next();
};

router.use(authenticateToken);

router.get('/', async (req: Request | any, res: Response) => {
    const user = req.user;
    let id;
    if(user !== undefined){
        if(user._id !== undefined){
            id = user._id;
            console.log(user, 'third case', id);
        } else {
            if(user.user !== undefined && user.user._id !== undefined){
                id = user.user._id;
                console.log(user, 'first case', id);
            }else{
                id = user.user.user._id;
                console.log(user, 'second case', id);
            }
        }   
    }

    const userInfo = await UserInfo.findOne({user: id});
    const userInfoObject = {
        First_Name: userInfo?.fname,
        Last_Name: userInfo?.lname,
        Birthday: userInfo?.bday,
        Street: userInfo?.street,
        City: userInfo?.city,
        Postal_Code: userInfo?.pcode
    }
    console.log(userInfoObject);
    res.render('private/index', {object: userInfoObject});
});

router.delete('/logout', async (req, res) => {
    res.clearCookie('authorization');
    res.clearCookie('refreshToken');
    res.redirect('../login');
})

export {router};
