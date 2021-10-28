'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.UserRole,{
        foreignKey: "user_id",
        as:"userRole"
      })
      this.hasOne(models.UserProfile,{
        foreignKey: "user_id",
        as:"userProfile"
      })
      this.hasMany(models.SiteVisitRequest,{
        foreignKey: "user_id",
        as:"siteVisitRequest"
      })
    }

    static authenticate (user, body){
      return new Promise(function (resolve, reject) {
        if (typeof body.password !== 'string') {
          resolve(null)
        }
        
        try {
          if (!user || user.get('hashed_password') === null || !bcrypt.compareSync(body.password, user.get('hashed_password'))) {
            resolve(null);
          }
  
          resolve(user);
  
        } catch (error) {
          resolve(null);
        }
      });
    };
  };
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.VIRTUAL,
      allowNull: true,
      set: function (value) {
        if (value !== null) {
          var salt = bcrypt.genSaltSync(10);
          var hashedPassword = bcrypt.hashSync(value, salt);
          this.setDataValue('password', value);
          this.setDataValue('salt', salt);
          this.setDataValue('hashed_password', hashedPassword);
        }
      }
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hashed_password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};