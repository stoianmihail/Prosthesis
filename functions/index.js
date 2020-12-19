const functions = require('firebase-functions');
const http = require('http');
const url = require('url');
const fs = require('fs');
var express = require('express')
var app = express()

app.set('view engine', 'ejs');

app.route('/', function(req, res) {
  console.log("send: " + __dirname + '/index.html');
   res.sendFile(__dirname + '/index.html');
});

globalPath = __dirname + '/../public';

app.route('/facility.ejs').get((req, res) => {
  path = url.parse(req.url)
  const queryObject = url.parse(req.url, true).query;
  console.log(queryObject)
  if (queryObject.id) {
    var id = queryObject.id;
    console.log(queryObject.id);
    
    let rawData = fs.readFileSync(globalPath + '/db/facility.json');
    let facilities = JSON.parse(rawData);
    rawData = fs.readFileSync(globalPath + '/db/patient.json');
    let patients = JSON.parse(rawData)
    let gathered = []
    
    // Determine its partition
    for (var i = 0; i != patients.length; ++i) {
      var p = patients[i];
      var minDist = Number.POSITIVE_INFINITY, chosen = -1;
      for (var j = 0; j != facilities.length; ++j) {
        var facility = facilities[j];
        var dist = Math.sqrt(Math.pow(p["coordinates"]["top"] - facility["coordinates"]["top"], 2) + Math.pow(p["coordinates"]["left"] - facility["coordinates"]["left"], 2));
        if (dist < minDist) {
          minDist = dist;
          chosen = j;
        }
      }
      if (chosen == id) {
        gathered.push(patients[i])
      }
    }
    
    gathered.sort(function(l, r) { return (l.sum * r.total) > (r.sum * l.total) ? 1 : -1});
    console.log(gathered)
    
    res.render('facility', {facility : facilities[id], data : gathered}); 
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

exports.app = functions.https.onRequest(app);
