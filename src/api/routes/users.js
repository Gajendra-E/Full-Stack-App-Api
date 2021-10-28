var express = require('express');
var router = express.Router();
import userController from '../../controllers/user'
 import checkAuth from "../../middleware/check-auth";

/*
  * Method: GET
  * query Parameter: None
  * Return: Return all user array of objects 
  * URl:/user
*/
router.get("/", checkAuth, userController.fetch_all_users);


/*
  * Method: POST
  * query Parameter: None
  * Body Parameters: email and password
  * Return: Return user object 
  * URl:/user/login
*/
router.post('/login', userController.login);

module.exports = router;
