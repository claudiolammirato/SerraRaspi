const Gpio = require('onoff').Gpio; // Gpio class
const settings = require('./settings')

const values = settings.readData()
let val = JSON.parse(values);
       // Export GPIO17 as an output
let stopBlinking = false;
 
// Toggle the state of the LED connected to GPIO17 every 200ms
module.exports.LightOn = function exec() {
  try {
  const light = Number(val.light)
  const led = new Gpio(light, 'out');
    
  if (stopBlinking) {
    return led.unexport();
  }
 
  led.read((err, value) => { // Asynchronous read
    //console.log(value)
    if (err) {
      throw err;
    }
  })
    led.write(0, err => { // Asynchronous write
      if (err) {
        throw err;
      }
    });
  

  }catch(err){
    console.error(err);
  
  }
 
  //setTimeout(blinkLed, 2000);
};

module.exports.LightOff = function exec() {
  try{
    const led = new Gpio(25, 'out');
    if (stopBlinking) {
      return led.unexport();
    }
   
    led.read((err, value) => { // Asynchronous read
      //console.log(value)
      if (err) {
        throw err;
      }
   
      led.write(1, err => { // Asynchronous write
        if (err) {
          throw err;
        }
      });
    });
   
  }catch (err){
    console.error(err);
  }
    //setTimeout(blinkLed, 2000);
  };
 

 
// Stop blinking the LED after 5 seconds
//setTimeout(_ => stopBlinking = true, 10000);