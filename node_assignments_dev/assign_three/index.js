var fs = require('fs');
var http = require('http');
// var dispatcher = require('httpdispatcher');

var server = http.createServer(handleRequest);
	

server.listen(3080, '127.0.0.1');
console.log("server is listening at http://127.0.0.1:3080");


function handleRequest(req, res) {
	// //initially came as undefined.
	// console.dir(req.param);
	// if (req.method == 'POST') {
	// 	console.log("its a post request");
	// };
	// if (req.method == 'GET') {
	// 	console.log("its a get request");
	// };
	// //send output to the html page.
	// res.end("server is listening at http://127.0.0.1:3000");
	console.log("________________________________");
	console.dir(req);
	console.dir(res);
	console.log("________________________________");
	console.log(req.url);

	if (req.url === "/") {
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.end('in resources folder');
		console.dir("in resources folder");
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
		//Sync function for reading the file.
		var img = fs.readFileSync('resources/images/img_not_found.jpg');
		var imageData = new Buffer(img).toString('base64');
		res.writeHead(200, {'Content-type': 'text/html'});
		res.write("<img align='center' left='100px' src='data:img_not_found.jpg;base64,"+imageData+"' height='500px' width='500px'/>");
		res.end();

		//Async function for reading the file.
		// var img = fs.readFile('resources/images/img_not_found.jpg', function(err, file) {
		// 	var imageData = new Buffer(file).toString('base64');
		// 	res.writeHead(400, {'Content-Type': "text/html"});
		// 	res.write("<img align='center' left='20' src='data:img_not_found.jpg;base64,"+imageData+"' height='500px' width='500px'/>");
		// 	res.end();
		// });
	}

	//Using httpdispatcher package.
	// try {
	// 	console.log(req.url);
	// 	dispatcher.dispatch(req,res);
	// } catch(err) {
	// 	console.log(err);
	// }
}


// //for all your static (js/css/images/etc.) set a directory name (relative path).
// dispatcher.setStatic('resources');

// //A simple GET request
// dispatcher.onGet("/page1", function(req,res) {
// 	res.writeHead(200, {'Content-Type': 'text/plain'});
// 	res.end('Page One');	
// })

// //A simple GET request
// dispatcher.onGet("/page2", function(req,res) {
// 	res.writeHead(200, {'Content-Type': 'text/plain'});
// 	res.end('Page two');
// })

// //A simple POST request
// dispatcher.onPost("/post1", function(req, res) {
// 	res.writeHead(200, {'Content-Type': 'text/plain'});
// 	res.end('Got the Post Data');
// })

