var axios = require('axios');
const session = require('express-session');
const qs = require('qs')
axios.defaults.withCredentials = true
var setCookie = require('set-cookie-parser');


email = 'claudio.lammirato@gmail.com'
password = '123456'
 
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
      const email = 'claudio.lammirato@gmail.com'
    const password = '123456'
      console.log(cookies[0].value)
      var config1 = {
        method: 'post',
        url: 'https://adaptable-wood-macaroni.glitch.me//users/loginconnection?email=' + email + '&password=' + password,
        headers: { 
          'Cookie': 'connect.sid='+cookies[0].value
        }
      };

      axios(config1)
      .then(function (response) {
        console.log(JSON.stringify(response.data.password));
      })        
      .catch(function (error) {
        console.log(error);
      });




}).catch(err => {
    console.log(err);
})




