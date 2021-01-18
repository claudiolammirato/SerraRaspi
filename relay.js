const Gpio = require('onoff').Gpio; // Gpio class
const led = new Gpio(25, 'out');       // Export GPIO17 as an output
let stopBlinking = false;
 
// Toggle the state of the LED connected to GPIO17 every 200ms
module.exports.LightOn = _ => {
  if (stopBlinking) {
    return led.unexport();
  }
 
  led.read((err, value) => { // Asynchronous read
    console.log(value)
    if (err) {
      throw err;
    }
 
    led.write(0, err => { // Asynchronous write
      if (err) {
        throw err;
      }
    });
  });
 
  //setTimeout(blinkLed, 2000);
};

module.exports.LightOff = _ => {
    if (stopBlinking) {
      return led.unexport();
    }
   
    led.read((err, value) => { // Asynchronous read
      console.log(value)
      if (err) {
        throw err;
      }
   
      led.write(1, err => { // Asynchronous write
        if (err) {
          throw err;
        }
      });
    });
   
    //setTimeout(blinkLed, 2000);
  };
 

 
// Stop blinking the LED after 5 seconds
//setTimeout(_ => stopBlinking = true, 10000);