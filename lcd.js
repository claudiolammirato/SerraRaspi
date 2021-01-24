// Import the module
const LCD = require('raspberrypi-liquid-crystal');

// Instantiate the LCD object on bus 1 address 3f with 16 chars width and 2 lines
const lcd = new LCD(1, 0x27, 16, 2);
lcd.beginSync();

module.exports.writeDisplay = function writeDisplay(line0, line1){
// Init the lcd (must be done before calling any other methods)

// Clear any previously displayed content
lcd.clearSync();
// Display text multiline
lcd.printLineSync(0, line0);
lcd.printLineSync(1, line1);
}
