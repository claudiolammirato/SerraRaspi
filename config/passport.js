const LocalStrategy = require('passport-local').Strategy;
const axios = require('axios')
const bcrypt = require('bcryptjs')
const qs = require('qs')
axios.defaults.withCredentials = true
var setCookie = require('set-cookie-parser');





// Load User model
const User = require('../models/User');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      //User.findOne({
        //email: email
        //console.log(password)
        
 
          const config = {
            url: 'https://adaptable-wood-macaroni.glitch.me//users/loginconnection',
            method: 'post',        
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: qs.stringify({
                'email': email,
                'password': password
            }),
        }

        axios(config).then(res => {
            var cookies = setCookie.parse(res, {
                decodeValues: true  // default: true
              });
              //console.log(cookies[0].value)
              var config1 = {
                method: 'post',
                url: 'https://adaptable-wood-macaroni.glitch.me//users/loginconnection?email=' + email + '&password=' + password,
                headers: { 
                  'Cookie': 'connect.sid='+cookies[0].value
                }
              };

              axios(config1)
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
          })

  )

    
  

      passport.serializeUser(function(user, done) {
        done(null, user);
      });
      
      passport.deserializeUser(function(user, done) {
        done(null, user);
      });
  
};
