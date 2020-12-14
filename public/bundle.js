(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
document.addEventListener('DOMContentLoaded', (event) => {
  
  //var img = document.createElement("img");
  
  //img.src = "image.png";
  //var src = document.getElementById("x");
  
  //src.appendChild(img);
  
  
  var fs = require('fs')
  
  const response = JSON.parse(fs.readFileSync('pin.json', 'utf8'));
  console.log(response)
  
  /*var pin1 = document.getElementById("pin_1"), pin2 = document.getElementById("pin_2");
		
  mouseOver = function(elem) {
    console.log(elem.id)
  }
  
  mouseOut = function(elem) {
    console.log(elem.id)
  }*/
})

},{"fs":2}],2:[function(require,module,exports){

},{}]},{},[1]);
