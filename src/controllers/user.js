import db from '../models'
import { registerUser } from '../helpers/userHelper'
import jwt from "jsonwebtoken";
require('dotenv').config();

exports.fetch_all_users= async (req, res, next) => {
    try {
        let fetchUsers = await db.User.findAll({include: [
            {
                model: db.UserRole,
                as: 'userRole',
                include: [
                    {
                        model: db.Role,
                        as: "role",
                    },
                ],
            },
            {
                model: db.UserProfile,
                as: 'userProfile',
            }
        ]});
        res.status(200).json({
            status: 'success',
            payload: fetchUsers,
            message: 'Users fetched successfully'
        });
    } catch (error) {
        console.log("Error ==> " + error)
        res.status(500).json({
            status: 'failed',
            payload: {},
            message: 'Error while fetching Users'
        });
    }

}

exports.login = async (req, res, next) => {
    try {
        const { email,password } = req.body;
    
        let fetchUser = await db.User.findOne({
            where: {
                email: email
            },
            include: [
                {
                    model: db.UserProfile,
                    as: 'userProfile'
                },
                {
                    model: db.UserRole,
                    as: 'userRole',
                    include: [
                        { 
                          model: db.Role,
                          as: 'role'
                        }
                    ]
                }
            ]
        });
       
         console.log(JSON.stringify(fetchUser))
        if(fetchUser === null){
            return res.json({
                status: 'failed',
                payload: fetchUser,
                message: 'Invalid username'
            });
        }
        else{
         
        let isExistUser = await db.User.authenticate(fetchUser, req.body);

        if(isExistUser !== null){

            let userObj = {};
            userObj.user_id = fetchUser.id;
            userObj.first_name = fetchUser.userProfile.first_name;
            userObj.last_name = fetchUser.userProfile.last_name;
            userObj.email =fetchUser.email;
            userObj.user_type = fetchUser.userRole.role.code;
            userObj.user_role_name = fetchUser.userRole.role.name;
          
            // let token = jwt.sign(userObj, process.env.JWT_PRIVATE_KEY, { expiresIn: '1h' });
        let token = jwt.sign(userObj, process.env.JWT_PRIVATE_KEY);
            // console.log("--5555555----"+token);
            res.status(200).json({
                status: 'success',
                token:token,
                payload: userObj,
                message: 'User loggedin successfully'
            });
        }
        
        else{
            res.json({
                status: 'failed',
                payload: {},
                message: 'Invalid username or password'
            });
        }

    }
        
    } catch (error) {
        res.status(500).json({
            status: 'failed',
            payload: {},
            message: 'Error while logging in'
        });
    }
}




