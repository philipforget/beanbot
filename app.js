var express = require('express');

var app = express.createServer();

app.get('/', function(req, res){
    res.send('Fuck');
})

app.listen(3000);
