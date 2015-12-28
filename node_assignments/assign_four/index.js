var http = require('http');
var qs = require('querystring');
var fs = require('fs');
var js2xml = require('js2xmlparser');
var jsonlint = require('jsonlint');


var server = http.createServer(httpHandler);

server.listen(3000,'127.0.0.1');
console.log("server listening at 127.0.0.1:3000");

function httpHandler(req, res) {
	//console.dir(res);
	//console.dir(req);
	//console.log("http : " + JSON.stringify(http));
	console.log("[index.js] >> [httpHandler]");

	if (req.method.toLowerCase() == "get") {
		getJsonObject("source.json", function(jsonObject) {
			try {
				if (jsonObject == "error") {
					console.log("Error has occured!!");
				} else {
					if (jsonObject.students.length == 0) {
						
					} else if (jsonObject.students.length > 0 ) {
						var jsonData = qs.parse(req.url.split('?')[1]);
						
						var filter = jsonData["q"];
						if (!filter) {
							filter = '';
						}
						var filteredData = filterJSON(jsonObject, filter);
						sortedJson = sortJsonObject("desc", filteredData);
					}
					//Check what kind of response data does the request wants.
					var outputData = "";
					if (req.headers.accept == "text/plain") {
						outputData = generateText(sortedJson);
						res.end(outputData);
					} else if (req.headers.accept == "application/xml") {
						outputData = generateXML(sortedJson);
						res.end(outputData);
					} else if (req.headers.accept == "application/json") {
						outputData = generateJSON(sortedJson);
						res.end(JSON.stringify(outputData));
					} else {
						res.end("Requested response type format is not supported currently!!");
					}
				}
			} catch (exp) {
				res.end(exp);
			}
		});
	}
}

/*
 * Return student objects whose first and last name matches filter parameter.
 */
function filterJSON(jsonObject, filter) {
	console.log("[index.js] >> [filterJSON]");
	var i, output = [];

	i = 0;
	while (i < jsonObject.students.length) {
		if ((jsonObject.students[i]["fname"].toLowerCase().search(filter) > -1) || (jsonObject.students[i]["lname"].toLowerCase().search(filter) > -1)) {
			output.push({
				"id" : jsonObject.students[i]["id"],
				"fname" : jsonObject.students[i]["fname"],
				"lname" : jsonObject.students[i]["lname"],
				"score" : jsonObject.students[i]["score"]
			})
		};
		i++;
	}
	return  output || '';
}

/*
 * Reads source.json file and returns the json in object format.
 */
function getJsonObject(sourcefilepath, cb) {
	console.log("[index.js] >> [getJsonObject]");
	fs.exists(sourcefilepath, function(doesExist) {
		if (doesExist) {
			fs.readFile(sourcefilepath, 'utf8', function(err,data) {
				if (err) { throw err};
				try	{
					data = jsonlint.parse(data);
				} catch (err) {
					console.log("source json file is invalid as per jsonlint. \n\n" + err);
				} finally {
					cb(data);
				}
			});
		}
	});
}

/*
 * Returns sorted json object as per the sort order mentioned, else returns data in desc order.
 */
function sortJsonObject(sortOrder, jsonObject) {
	console.log("[index.js] >> [sortJsonObject]");
	if (sortOrder === "asc") {
		jsonObject.sort(function(a,b) {
			return a.score - b.score;
		});
	} else if (sortOrder === "desc") {
		jsonObject.sort(function(a,b) {
			return b.score - a.score;
		});
	} else {
		jsonObject.sort(function(a,b) {
			return b.score - a.score;
		});
	}
	return jsonObject;
}

/*
 * Returns input jsonObject in xml format.
 */
function generateXML(jsonObject) {
	console.log("[index.js] >> [generateXML]");
	var newData = {}, student =[], len = jsonObject.length, output='';
	for (var i = 0; i < len; i++) {
		student.push({
			"@" : {
				"id" : jsonObject[i].id 
			},
			"name"  : jsonObject[i].fname + " " + jsonObject[i].lname,
			"score"  : jsonObject[i].score,			
		});
	}
	newData = {	student };
	if (i == len) {
		output = js2xml("students", newData);
	} 
	return output || "";
}

/*
 * Returns input jsonObject in tabular format.
 */
function generateText(jsonObject) {
	console.log("[index.js] >> [generateText]");
	var output = null;
	output = ("ID\t\tFirst Name\t\tLast Name\t\tScore\n");
	for (var i = 0; i < jsonObject.length; i++) {
		output += jsonObject[i].id + "\t\t" + jsonObject[i].fname + "\t\t\t" + jsonObject[i].lname  + "\t\t\t" + jsonObject[i].score + "\n";
	}	
	return output || "";
}


/*
 * Restructures input jsonObject and return a jsonObject.
 */
function generateJSON(jsonObject) {
	console.log("[index.js] >> [generateJSON]");
	var output = {
		"students" : []
	};
	for (var i = 0; i < jsonObject.length; i++) {
		output.students.push({
			"id": jsonObject[i].id,
			"fullName": jsonObject[i].fname + " " + jsonObject[i].lname,
			"score": jsonObject[i].score
		})
	}
	return output || "";
}
