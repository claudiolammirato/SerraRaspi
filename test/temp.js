const sensor = require("node-dht-sensor").promises;
 
async function exec() {
  try {
    const res = await sensor.read(22, 17);
    console.log(
      `temp: ${res.temperature.toFixed(1)}°C, ` +
        `humidity: ${res.humidity.toFixed(1)}%`
    );
    return res;
  } catch (err) {
    console.log("Failed to read sensor data:", err);
  }
}

async function exec2() {
    try {
      const res = await sensor.read(22, 27);
      console.log(
        `temp2: ${res.temperature.toFixed(1)}°C, ` +
          `humidity2: ${res.humidity.toFixed(1)}%`
      );
      return res;
    } catch (err) {
      console.log("Failed to read sensor data:", err);
    }
  }
 
  exec();
  exec2();