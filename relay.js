const gpio = require("gpio");
const gpio15;
 
// Flashing lights if LED connected to GPIO15
gpio15 = gpio.export(15, {
   ready: function() {
      intervalTimer = setInterval(function() {
         gpio15.set(); //pin HIGH
         //gpio4.set(0); //pin LOW
         setTimeout(function() { gpio15.reset(); }, 500);
      }, 1000);
   }
});