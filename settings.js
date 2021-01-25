var fs = require('fs');

module.exports.writeData = function writeData(name, email, light, temp_int, temp_ext, timer, timersh, timersd, timereh, timered,){
    var myOptions = {
        name: name,
        email: email,
        light: light,
        temp_int: temp_int,
        temp_ext: temp_ext,
        timer: timer,
        timersh: timersh,
        timersd: timersd,
        timereh: timereh,
        timered: timered        
      };
      
      var data = JSON.stringify(myOptions);
    fs.writeFileSync('./config.json', data, function (err) {
    if (err) {
        console.log('There has been an error saving your configuration data.');
        console.log(err.message);
        return;
    }
    console.log('Configuration saved successfully.')
    });
}

module.exports.readData = function readData(){
    const dataread =  fs.readFileSync('./config.json', {encoding:'utf8', flag:'r'}); 
    
    // Display the file data 
    //console.log(dataread); 
    return dataread;
}

