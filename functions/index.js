const functions = require('firebase-functions');
var admin = require('firebase-admin');
const path = require('path');
const http = require('http');
const url = require('url');
const fs = require('fs');
var express = require('express');
var app = express();

app.set('view engine', 'ejs');

var config = {
  apiKey: "AIzaSyBmQVIwwGgud9N7OXx-IE7jLWwd02XGD6s",
  authDomain: "prosthesis-30783.firebaseapp.com",
  databaseURL: "https://prosthesis-30783-default-rtdb.firebaseio.com",
};

admin.initializeApp(config);

app.route('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.route('/donate.ejs').get((req, res) => {  
  res.render('donate', {});
});

app.route('/mydonations.ejs').get((req, res) => {
  const queryObject = url.parse(req.url, true).query;
  console.log(queryObject)
  if (queryObject.id) {
    var id = parseInt(queryObject.id);
    var data = {id : queryObject.id} 
    res.render('mydonations', {data : data}); 
  } else {
    res.status(404).send('<h1> Page not found </h1>');
  }
});

app.route('/facility.ejs').get((req, res) => {
  const queryObject = url.parse(req.url, true).query;
  console.log(queryObject)
  if (queryObject.id) {
    var id = parseInt(queryObject.id);
    var data = {id : queryObject.id} 
    res.render('facility', {data : data}); 
  } else {
    res.status(404).send('<h1> Page not found </h1>');
  }
});

app.route('/case.ejs').get((req, res) => {
  const queryObject = url.parse(req.url, true).query;
  console.log(queryObject)
  if (queryObject.id) {
    console.log(queryObject.id)
    var data = {id : queryObject.id} 
    res.render('case', {data : data}); 
  } else {
    res.status(404).send('<h1> Page not found </h1>');
  }
});

app.use(express.static(__dirname));

exports.app = functions.https.onRequest(app);
