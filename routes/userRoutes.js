//need to import the express framework
const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

//create middleware router
const userRouter = express.Router();

//user endpoints that are open to everyone
userRouter.post('/signup', authController.signup);
userRouter.post('/login', authController.login);
userRouter.get('/logout', authController.logout);
userRouter.post('/forgotPassword', authController.forgotPassword);
userRouter.patch('/resetPassword/:token', authController.resetPassword);

// protects all of the routes that are below this line of code
userRouter.use(authController.protect);

//update password
userRouter.patch('/updateMyPassword', authController.updatePassword);

//get your own info
userRouter.get('/me', userController.getMe, userController.getUserById);

//update your info
userRouter.patch('/updateMe', userController.updateMe);

//delete yourself
userRouter.delete('/deleteMe', userController.deleteMe);

//protects all of the routes that are below this line of code so only admin can do hat is intended
userRouter.use(authController.restrictTo('admin'));

userRouter
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

userRouter
  .route('/:id')
  .get(userController.getUserById)
  .patch(userController.updateUserById)
  .delete(userController.deleteUser);

module.exports = userRouter;
