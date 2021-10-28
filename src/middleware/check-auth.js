import jwt from "jsonwebtoken";
import db from "../models/index";
require('dotenv').config();

module.exports = async (req, res, next)=> {
    try {
        const headers = req.headers;       
            if (headers.hasOwnProperty('authorization')) {
                const token = req.headers.authorization.split(" ")[1];
                const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
               req.userData = decoded;
                if(Object.keys(decoded).length > 0){
                    let user_id=decoded.user_id
                    let fetchUser = await db.UserProfile.findOne({ where: { id: user_id}});
                    if(fetchUser === null){
                        return res.status(401).json({
                            status: 'failed',
                            message: 'Auth failed'
                        });
                    }
                    next(); 
               
                }else{
                    return res.status(401).json({
                        status: 'failed',
                        message: 'Auth failed'
                    });
                }
            }
            else {
                return res.status(401).json({
                    status: 'failed',
                    message: 'Auth failed'
                });
            }
    }
    catch (error) {
        return res.status(401).json({
            status: 'failed',
            error:`${error}`,
            message: 'Auth failed'
        });
    }            
}