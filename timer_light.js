const relay = require('./relay');



module.exports.triggerON =  async function exec(dates, datee) {
//console.log(dates)
//console.log(datee)
var now = new Date();
//console.log(now)
var start = now - dates;
var end = now - datee;

//console.log(start)
//console.log(end)
if (start > 0 && end <0) {
     await relay.LightOn();
     console.log('light on') // it's after 10am, try 10am tomorrow.
     } else if(start > 0 && end >0){
          await relay.LightOff();
          console.log('light off')
     } else if(start < 0 && end >0 || end <0 ){
          await relay.LightOff();
          console.log('off')
     }
}

