const express = require('express');
const router = express.Router();
const passport = require('passport');
var http = require('http');// Load User model
const User = require('../models/User');
const { forwardAuthenticated } = require('../config/auth');
const axios = require('axios')

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Login
router.post('/login', (req, res, next) => {
    //passport.authenticate('local', {
    //successRedirect: '/',
    //failureRedirect: '/users/login'
  //})(req, res, next)
  axios.post('http://127.0.0.1:5000/users/login', {
    email: 'claudio.lammirato@gmail.com',
    password: '123456'
  })
  .then((response) => {
    console.log(response);
  }, (error) => {
    console.log(error);
  });});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/users/login');
});

module.exports = router;
