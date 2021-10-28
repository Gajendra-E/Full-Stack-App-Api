import db from '../models'
module.exports ={
    registerUser: (body)=> {
        return new Promise(async (resolve, reject)=> {
            try {
                let { email,  password ,first_name, last_name,date_of_birth,gender, user_type } = body;
               
                let  fetchUser = await db.User.findOne({
                    where:{
                        email:email
                    }
                })
                if(fetchUser!==null){
                        reject("user already exist");
                }

                let fetchRole = await db.Role.findOne({
                    where:{
                        code:user_type
                    }
                })
                if (fetchRole === null) {
                    reject("Role does not exist");
                }
               
                let newUser = await db.User.create({
                    email: email,
                    password: password !== undefined && password !== null ? password : null,
                    status: 'ACTIVE'
                });
                
                await db.UserRole.create({
                    role_id: fetchRole.id,
                    user_id: newUser.id,
                    status:"ACTIVE"
                });
                await db.UserProfile.create({
                    user_id: newUser.id,
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    date_of_birth:date_of_birth,
                    gender:gender,
                    status:"ACTIVE"
                });

                let fetchCreatedUser = await db.User.findOne({
                    where: {
                        id: newUser.id
                    },
                    include: [
                        {
                            model: db.UserRole,
                            as: 'userRole',
                        },
                        {
                            model: db.UserProfile,
                            as: 'userProfile',
                        }
                    ]
                });
                resolve(fetchCreatedUser);
            } catch (error) {
                console.log('Error at register user function => '+error);
                resolve(null);
            }
        });
    },
}