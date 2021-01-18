const express = require('express')
const app = express()
const port = 3000

//Import own function and values
const {tempint, tempext} = require('./tempread');
const {analog} = require('./ads1115')

//ejs setting
app.set('view engine', 'ejs');

//async function retrieve data
async function appasync () {
    const tint = await tempint();
    const text = await tempext();
    const moisture = await analog;
    //console.log(moisture)
    //console.log(tint);
    //console.log(text);
    return [tint, text, moisture];
}

//appasync().then(function([tint, text, moisture]) {console.log('done calling app() ' + tint.temperature +' '+ text.temperature+' '+moisture[1])});

//routes
app.get('/', function(req, res) {
 
  appasync().then(function([tint, text, moisture]) {res.render('serra.ejs', {
    tinthum: tint.humidity.toFixed(1),
    tinttemp: tint.temperature.toFixed(1), 
    texthum: text.humidity.toFixed(1), 
    texttemp: text.temperature.toFixed(1)
  })});
  
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})