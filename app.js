var express = require('express');

var app = express.createServer();

app.use(express.static(__dirname));
app.set('views', __dirname)

app.get('/', function(req, res){
    res.render('index.jade', {layout: false});
});
