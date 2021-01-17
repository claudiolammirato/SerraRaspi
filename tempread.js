var sensor = require("node-dht-sensor");
 
sensor.read(22, 27, function(err, temperature, humidity) {
  if (!err) {
    console.log(`Sensore interno temp: ${temperature}°C, humidity: ${humidity}%`);
  }
});

sensor.read(22, 17, function(err, temperature, humidity) {
    if (!err) {
      console.log(`Sensore esterno temp: ${temperature}°C, humidity: ${humidity}%`);
    }
  });