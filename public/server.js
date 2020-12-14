const http = require('http');
const url = require('url');
const fs = require('fs');
const port = 8080; 

var map = {'js' : 'text/javascript', 'css' : 'text/css', 'png' : 'image/png', 'json' : 'application/json', 'ico' : 'image/x-icon'}

function readFileWrapper(res, pathname) {
  var ext = path.pathname.substr(path.pathname.lastIndexOf('.') + 1);
  var type = map[ext]
  console.log("read " + pathname)
  res.writeHead(200, {'Content-Type': type})
  fs.readFile(__dirname + pathname, function(error, data) {
    if (error) {
      res.writeHead(404)
      res.write('Error: File not found')
    } else {
      res.write(data)
    }
    res.end()
  })
}

const server = http.createServer(function(req, res) {
  path = url.parse(req.url)
  switch(path.pathname) {
    case '/': {
      // Load index.html
      res.writeHead(200, {'Content-Type': 'text/html'})
      fs.readFile('index.html', function(error, data) {
        if (error) {
          res.writeHead(404)
          res.write('Error: File not found')
        } else {
          res.write(data)
        }
        res.end()
      })
      break;
    }
    default: {
      // Load others
      readFileWrapper(res, path.pathname)
      break;
    }
  }
})

server.listen(port, function(error) {
  if (error) {
    console.log('Something went wrong', error)
  } else {
    console.log('Server is listening on port ' + port)
  }
})
