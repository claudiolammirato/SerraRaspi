const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = 3000
const passport = require('passport');
const mongoose = require('mongoose');
const session = require('express-session');

//Import own function and values
const {tempint, tempext} = require('./tempread');
const {analog} = require('./ads1115')
const database = require('./database')
const lcd = require('./lcd')
const settings = require('./settings')
const timer_l = require('./timer_light')
const { ensureAuthenticated, forwardAuthenticated } = require('./config/auth');

//ejs setting
app.set('view engine', 'ejs');

//middleware link node modules
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
//app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use('/ch', express.static(__dirname + '/node_modules/chart.js')); // redirect Chartjs


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true
  })
);
 
// parse application/json
app.use(bodyParser.json())

// Passport Config
require('./config/passport')(passport);

//Passport
app.use(passport.initialize());
app.use(passport.session());

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true ,useUnifiedTopology: true}
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => 
    //console.log(err)
    console.log('MongoDB Error')
    );


//routes
app.use('/users', require('./routes/login.js'));
app.use('/', require('./routes/index.js'));


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

//set Timer
async function timerLight() {
  //sconsole.log('dentro')
  const values = settings.readData()
  let val = JSON.parse(values);
  if(val.timer == 'ON'){
    //console.log(val.timersd.split('-')[1])
    const hs = Number(val.timersh.split(':')[0])
    const mins = Number(val.timersh.split(':')[1])
    const ys = Number(val.timersd.split('-')[0])
    const ms = Number(val.timersd.split('-')[1])
    const ds = Number(val.timersd.split('-')[2])

    const he = Number(val.timereh.split(':')[0])
    const mine = Number(val.timereh.split(':')[1])
    const ye = Number(val.timered.split('-')[0])
    const me = Number(val.timered.split('-')[1])
    const de= Number(val.timered.split('-')[2])
    
    //console.log(Date(y, m, d, h, min))
    timer_l.triggerON(new Date(ys, ms-1, ds, hs, mins),new Date(ye, me-1, de, he, mine))
  } 
}
setInterval(timerLight, 30000);


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




app.listen(port, '0.0.0.0', () => {
  console.log(`Example app listening at http://localhost:${port}`)
})