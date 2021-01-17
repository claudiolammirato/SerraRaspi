const ADS1115 = require('ads1115')
const i2c = require('i2c-bus')


module.exports.analog = i2c.openPromisified(1).then(async (bus) => {
  const ads1115 = await ADS1115(bus)
  
  // ads1115.gain = 1
 
  //for (let i = 0; i < 5; i++) {
    let value0 = await ads1115.measure('0+GND')
    let value1 = await ads1115.measure('1+GND')
    let value2 = await ads1115.measure('2+GND')
    let value3 = await ads1115.measure('3+GND')
    //console.log('Valore A0: '+value0)
    //console.log('Valore A1: '+value1)
    //console.log('Valore A2: '+value2)
    //onsole.log('Valore A3: '+value3)
  //}
  return [value0, value1, value2, value3];
  
  
})

