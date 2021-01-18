const sensor = require("node-dht-sensor").promises;
 
module.exports.tempint = async function exec() {
  try {
    const res = await sensor.read(22, 17);
    //console.log(
      //`temp: ${res.temperature.toFixed(1)}°C, ` +
        //`humidity: ${res.humidity.toFixed(1)}%`
    //);
    return res;
  } catch (err) {
    console.error("Failed to read sensor data:", err);
  }
}

module.exports.tempext = async function exec() {
    try {
      const res = await sensor.read(22, 27);
      //console.log(
        //`temp: ${res.temperature.toFixed(1)}°C, ` +
          //`humidity: ${res.humidity.toFixed(1)}%`
      //);
      return res;
    } catch (err) {
      console.error("Failed to read sensor data:", err);
    }
  }
 
