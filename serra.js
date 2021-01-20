const express = require('express')
const app = express()
const port = 4000

//Import own function and values
const {tempint, tempext} = require('./tempread');
const {analog} = require('./ads1115')
const light = require('./relay');
//ejs setting
app.set('view engine', 'ejs');

//async function retrieve data
async function retrieve_values () {
    const tint = await tempint();
    const text = await tempext();
    const moisture = await analog();
    //console.log(moisture)
    //console.log(tint);
    //console.log(text);
    return [tint, text, moisture];
}

//appasync().then(function([tint, text, moisture]) {console.log('done calling app() ' + tint.temperature +' '+ text.temperature+' '+moisture[1])});

//routes
app.get('/', function(req, res) {
 
retrieve_values().then(function([tint, text, moisture]) {res.render('serra.ejs', {
    tinthum: tint.humidity.toFixed(1),
    tinttemp: tint.temperature.toFixed(1), 
    texthum: text.humidity.toFixed(1), 
    texttemp: text.temperature.toFixed(1),
    light: moisture[0],
    moisture: moisture[1]
  })});
  
});

app.post('/lighton', async function(req, res) {
    await light.LightOn();
    res.redirect('/');
})

app.post('/lightoff', async function(req, res) {
  await light.LightOff();
  res.redirect('/');
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})