var axios = require('axios');

email = ''
password = ''

var config = {
  method: 'post',
  url: 'https://adaptable-wood-macaroni.glitch.me//users/loginconnection?email=' + email + '&password=' + password,
  headers: { 
    'Cookie': 'connect.sid=s%3AdIyO8QF5E8s6zdmLE-Pl5J3I3MWRJjY8.4lKwFawfVL8jNV4LcqiAJQ3EZ3H8HRrKO4yXou44s9g'
  }
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});
