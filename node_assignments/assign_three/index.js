var fs = require('fs');
var http = require('http');

var server = http.createServer(handleRequest);

server.listen(3080, '127.0.0.1');
console.log("server is listening at http://127.0.0.1:3080");

function handleRequest(req, res) {
	if (req.url === "/") {
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.end('in resources folder');
	} else if (req.url == "/images/1") {
		var img = fs.readFileSync('resources/images/1');
		res.writeHead(200, {'Content-type': 'image/gif'});
		res.end(img,'binary');
	} else if (req.url == "/images/2") {
		var img = fs.readFileSync('resources/images/2');
		res.writeHead(200, {'Content-type': 'image/gif'});
		res.end(img,'binary');
	} else if (req.url == "/images/3") {
		var img = fs.readFileSync('resources/images/3');
		res.writeHead(200, {'Content-type': 'image/gif'});
		res.end(img,'binary');
	} else if (req.url == "/download/images/3") {
		var img = fs.readFileSync('resources/images/3');
		res.writeHead(200, {'Content-type': 'image/gif'});
		res.end(img,'binary');
	} else {
		var img = fs.readFileSync('resources/images/img_not_found.jpg');
		var imageData = new Buffer(img).toString('base64');
		res.writeHead(200, {'Content-type': 'text/html'});
		res.write("<img align='center' left='100px' src='data:img_not_found.jpg;base64,"+imageData+"' height='500px' width='500px'/>");
		res.end();
	}
}