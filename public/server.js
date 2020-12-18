const http = require('http');
const url = require('url');
const fs = require('fs');
var express = require('express')
var app = express()
const port = 8080;

app.set('view engine', 'ejs');

app.route('/', function(req, res) {
   res.sendFile(__dirname + '/index.html');
});

app.route('/facility.ejs').get((req, res) => {
  path = url.parse(req.url)
  const queryObject = url.parse(req.url, true).query;
  console.log(queryObject)
  if (queryObject.id) {
    console.log(queryObject.id)
    var data = {name : 'Test', id : queryObject.id} 
    res.render('facility', {data : data}); 
  } else {
    res.status(404).send('<h1> Page not found </h1>');
  }
});

app.route('/case.ejs').get((req, res) => {
  path = url.parse(req.url)
  const queryObject = url.parse(req.url, true).query;
  console.log(queryObject)
  if (queryObject.id) {
    console.log(queryObject.id)
    var data = {name : 'Test', id : queryObject.id} 
    res.render('case', {data : data}); 
  } else {
    res.status(404).send('<h1> Page not found </h1>');
  }
});

app.use(express.static(__dirname));

var sever = app.listen(port, function(error) {
  if (error) {
    console.log('Something went wrong', error)
  } else {
    console.log('Server is listening on port ' + port)
  }
})
