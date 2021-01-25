const sensor = require("node-dht-sensor").promises;
const settings = require('./settings')

const values = settings.readData()
let val = JSON.parse(values);
//console.log(val)
 
module.exports.tempint = async function exec() {
  try {
    const int_pin = Number(val.temp_int)
    const res = await sensor.read(22, int_pin);
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
      const ext_pin = Number(val.temp_ext)
      const res = await sensor.read(22, ext_pin);
      //console.log(
        //`temp: ${res.temperature.toFixed(1)}°C, ` +
          //`humidity: ${res.humidity.toFixed(1)}%`
      //);
      return res;
    } catch (err) {
      console.error("Failed to read sensor data:", err);
    }
  }
 
