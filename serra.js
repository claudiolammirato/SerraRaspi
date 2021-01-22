const express = require('express')
const app = express()
const port = 4000

//Import own function and values
const {tempint, tempext} = require('./tempread');
const {analog} = require('./ads1115')
const relay = require('./relay');
const database = require('./database')
const lcd = require('./lcd')

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

//Insert Data in Database every 30 minutes
async function data() {
  await retrieve_values().then(async function([tint, text, moisture]) {
    
    await database.database_insert(tint.temperature.toFixed(1), tint.humidity.toFixed(1), text.temperature.toFixed(1), text.humidity.toFixed(1), moisture[0], moisture[1], moisture[2])
  })
}
setInterval(data, 1800000);

//Display info every 30 seconds
async function data() {
  try{
  await retrieve_values().then(async function([tint, text, moisture]) {
    setTimeout(async function(){
    int = 'Tint='+tint.temperature.toFixed(1)+' Hint='+tint.humidity.toFixed(1)+'%'
    ext = 'Text='+text.temperature.toFixed(1)+' Hext='+text.humidity.toFixed(1)+'%'
    await lcd.writeDisplay(int,ext)},8000)
    setTimeout(async function(){
    moisture = 'Moisture='+moisture[0]
    water_level = 'Water Level='+moisture[1]
    await lcd.writeDisplay(moisture,water_level)},8000)
  })
} catch (err){
  console.log(err)
  }
}
setInterval(data, 16000);


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

app.get('/settings', function(req, res) {
 
  res.render('settings.ejs') 
    
});

app.post('/lighton', async function(req, res) {
    await relay.LightOn();
    res.redirect('/');
})

app.post('/lightoff', async function(req, res) {
  await relay.LightOff();
  res.redirect('/');
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})