const {tempint, tempext} = require('./tempread');
const {analog} = require('./ads1115')

const express = require('express')
const app = express()
const port = 3000


async function appasync () {
    const tint = await tempint();
    const text = await tempext();
    const moisture = await analog;
    console.log(moisture)
    console.log(tint);
    console.log(text);
    return [tint, text, moisture];
}

//appasync().then(function([tint, text, moisture]) {console.log('done calling app() ' + tint.temperature +' '+ text.temperature+' '+moisture[1])});


app.get('/', (req, res) => {
    appasync().then(function([tint, text, moisture]) {res.send({message: tint.temperature})});
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})