const LocalStrategy = require('passport-local').Strategy;
const axios = require('axios')
const bcrypt = require('bcryptjs')


// Load User model
const User = require('../models/User');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      //User.findOne({
        //email: email
        console.log(password)
        
        var axios = require('axios');

        var config = {
          method: 'post',
          url: 'https://adaptable-wood-macaroni.glitch.me//users/loginconnection?email=' + email + '&password=' + password,
          headers: { 
            'Cookie': 'connect.sid=s%3AdIyO8QF5E8s6zdmLE-Pl5J3I3MWRJjY8.4lKwFawfVL8jNV4LcqiAJQ3EZ3H8HRrKO4yXou44s9g'
          }
        };

        axios(config)
        .then(function (response) {
          //console.log(JSON.stringify(response.data.password));
          if(response.data.password === undefined){
              return done(null, false, { message: 'Password incorrect' })
          }
          bcrypt.compare(password, response.data.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, response.data.name);
            } else {
              return done(null, false, { message: 'Password incorrect' });
            }
          });
        })
        .catch(function (error) {
          console.log(error);
        });


      })
    )
    
  

      passport.serializeUser(function(user, done) {
        done(null, user);
      });
      
      passport.deserializeUser(function(user, done) {
        done(null, user);
      });
  
};
