const Router = require('express').Router();

const authViewController = require('../../Controller/view/authViewController');

// signup ----------------------------------
Router.get(
  '/signup/create-account',
  authViewController.renderCreateAccountPage
);
Router.get(
  '/signup/verify-account',
  authViewController.renderVerifyAccountPage
);

// login -----------------------------------
Router.get('/login/0', authViewController.renderEnterEmail);
Router.get('/login/1', authViewController.renderEnterPassword);
Router.get(
  '/forgotPassword/0',
  authViewController.renderForgotPasswordFindAccount
);
Router.get(
  '/forgotPassword/1',
  authViewController.renderForgotPasswordEnterOTP
);
Router.get('/forgotPassword/2', authViewController.renderSetNewPassword);

module.exports = Router;
