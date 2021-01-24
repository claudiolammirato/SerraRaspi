const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = 4000

//Import own function and values
const {tempint, tempext} = require('./tempread');
const {analog} = require('./ads1115')
const relay = require('./relay');
const database = require('./database')
const lcd = require('./lcd')
const settings = require('./settings')

//ejs setting
app.set('view engine', 'ejs');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

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
async function data1() {
  await retrieve_values().then(async function([tint, text, moisture]) {
    
    await database.database_insert(tint.temperature.toFixed(1), tint.humidity.toFixed(1), text.temperature.toFixed(1), text.humidity.toFixed(1), moisture[0], moisture[1], moisture[2])
  })
}
setInterval(data1, 1800000);

//Display info every 30 seconds

function toggleCalls () {
  var timer = {timeout: null};
  async function callA () {
    await retrieve_values().then(async function([tint, text, moisture]) {
  
    int = 'Ti='+tint.temperature.toFixed(1)+' Hi='+tint.humidity.toFixed(1)+'%'
    ext = 'Te='+text.temperature.toFixed(1)+' He='+text.humidity.toFixed(1)+'%'
    await lcd.writeDisplay(int,ext)
    //console.log("A Called");
    timer.timeout = setTimeout(callB, 10000);
    })
  }
  async function callB () {
    await retrieve_values().then(async function([tint, text, moisture]) {
  
    moisture = 'Moisture='+moisture[0]
    water_level = 'Water='+moisture[1]
    await lcd.writeDisplay(moisture,water_level)
    //console.log("B Called");
    timer.timeout = setTimeout(callA, 10000);
    })
  }
  callA();
  return timer;
}

var timer = toggleCalls();

//


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
  const values = settings.readData()
  let val = JSON.parse(values);
  console.log(val)
  res.render('settings.ejs', {
    name: val.name,
    email: val.email,
    light: val.light,
    tempint: val.temp_int,
    tempext: val.temp_ext,
    timer: val.timer
  }) 
    
});

app.post('/settingssave', function(req, res) {
  console.log(req.body.name)
  settings.writeData(req.body.name, req.body.email, req.body.light, req.body.tempint, req.body.tempext, req.body.timer)
  res.redirect('settings')   
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