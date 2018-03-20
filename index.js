const express = require('express')
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
app.use('/form', express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const home =  require(`./controllers/home.js`);;

app.get('/form', function (req, res){
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/result', home.process);

app.listen(3000, () => console.log('Example app listening on port 3000!'))