const express = require('express')
const router = express.Router();
var mysql = require('mysql');



const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const {tempint, tempext} = require('../tempread');
const {analog} = require('../ads1115')
const relay = require('../relay');
const settings = require('../settings')




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


//routes
router.get('/', ensureAuthenticated, function(req, res) {
    
    retrieve_values().then(function([tint, text, moisture]) {
      let tinthum
      let tinttemp
      let texthum
      let texttemp
      if(tint.humidity.toFixed(1)){
        tinthum = tint.humidity.toFixed(1)
        }else{
          tinthum = "Hum Int sensor error" 
        }
        if(tint.temperature.toFixed(1)){
          tinttemp = tint.temperature.toFixed(1)
          }else{
            tinttemp = "Temp Int sensor error" 
          }
        if(text.humidity.toFixed(1)){
          texthum = text.humidity.toFixed(1)
          }else{
            texthum = "Hum Ext sensor error" 
          }
        if(text.temperature.toFixed(1)){
          texttemp = text.temperature.toFixed(1)
          }else{
            texttemp = "Temp Ext sensor error" 
          }
        
        let m0 = moisture[0]
        let light;
    
        if(m0<1000){
          light = 'Light ON'
        }else{
          light = 'Light OFF'
        }
           
        const moisture1 = moisture[1]
    
        const water_level = moisture[2]
        
     
      res.render('serra.ejs', {
        tinthum: tinthum,
        tinttemp: tinttemp,
        texthum: texthum, 
        texttemp: texttemp,
        light: light,
        moisture: moisture1,
        waterl: water_level
      })});
      
    });
    
    router.get('/settings', ensureAuthenticated, function(req, res) {
      const values = settings.readData()
      let val = JSON.parse(values);
      //console.log(val.Dstop)
      res.render('settings.ejs', {
        name: val.name,
        email: val.email,
        light: val.light,
        fan: val.fan,
        pump: val.pump,
        tempint: val.temp_int,
        tempext: val.temp_ext,
        timer: val.timer,
        timersh: val.timersh,
        timersd: val.timersd,
        timereh: val.timereh,
        timered: val.timered
      }) 
        
    });
    
    router.get('/graph', ensureAuthenticated, function(req, res) {
      let interval;
      if(req.query.interval === undefined){
        interval = 48;
      }else{
        interval = req.query.interval;
      }
      
      var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        insecureAuth : true
        });
        con.connect(function(err) {
        if (err) throw err;
        console.log("Database Read");
        });
    
        con.query("USE serradb;", function (err, result, fields) {
    
            
            if (err) throw err;
            //console.log(result);
            });
    
        con.query("SELECT * FROM parameters_table; ", function (err, result) {
        
        if (err) throw err;
        //var resultArray = Object.values(JSON.parse(JSON.stringify(result)))
        //console.log(resultArray);
        var temp_int = [];
        var hum_int = [];
        var temp_ext = [];
        var hum_ext = [];
        var moisture = [];
        var water_level = [];
        var date = [];
        var temp_int_red = [];
        var hum_int_red = [];
        var temp_ext_red = [];
        var hum_ext_red = [];
        var moisture_red = [];
        var water_level_red = [];
        var date_red = [];
    
        //console.log( Object.keys( result ).length ) ;
    
      for(var i in result){
        temp_int.push(result [i].temp_int);
        hum_int.push(result [i].hum_int);
        temp_ext.push(result [i].temp_ext);
        hum_ext.push(result [i].hum_ext);
        moisture.push(result [i].moisture);
        water_level.push(result [i].water_level);
        date.push(result [i].date.toLocaleString());
      }
      for ( i = Object.keys( result ).length-interval; i<Object.keys( result ).length; i++){
        temp_int_red.push(temp_int[i])
        hum_int_red.push(hum_int[i])
        temp_ext_red.push(temp_ext[i])
        hum_ext_red.push(hum_ext[i])
        moisture_red.push(moisture[i])
        water_level_red.push(water_level[i])
        date_red.push(date[i])
      }
    
      res.render('graph.ejs', {
        temp_int: temp_int_red,
        hum_int: hum_int_red,
        temp_ext: temp_ext_red,
        hum_ext: hum_ext_red,
        moisture: moisture_red,
        water_level: water_level_red,
        date: date_red,
      }) 
    })
        
    });
    
    router.post('/settingssave', ensureAuthenticated, function(req, res) {
      //console.log(req.body.fan)
      settings.writeData(req.body.name, req.body.email, req.body.light, req.body.fan, req.body.pump, req.body.tempint, req.body.tempext, req.body.timer, req.body.Tstart, req.body.Dstart, req.body.Tstop, req.body.Dstop)
      res.redirect('settings')   
    });
    
    //light relay
    router.post('/lighton', ensureAuthenticated, async function(req, res) {
        await relay.LightOn();
        res.redirect('/');
    })
    
    router.post('/lightoff', ensureAuthenticated, async function(req, res) {
      await relay.LightOff();
      res.redirect('/');
    })
    
    //Fan relay
    router.post('/fanon', ensureAuthenticated, async function(req, res) {
      await relay.fanOn();
      res.redirect('/');
    })
    
    router.post('/fanoff', ensureAuthenticated, async function(req, res) {
    await relay.fanOff();
    res.redirect('/');
    })
    
    //Pump relay
    router.post('/pumpon', ensureAuthenticated, async function(req, res) {
      await relay.pumpOn();
      res.redirect('/');
    })
    
    router.post('/pumpoff', ensureAuthenticated, async function(req, res) {
    await relay.pumpOff();
    res.redirect('/');
    })
    
    router.post('/graph', ensureAuthenticated, async function(req, res) {
      const interval = req.body.interval;
      //console.log(interval)
      res.redirect('/graph?interval=' + interval);
    })

    module.exports = router;