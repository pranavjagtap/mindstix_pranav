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
	console.log("[index.js] >> [httpHandler]");
	//var jsonData = qs.parse(req.url.split('?')[1]);
	
//	console.log("http : " + JSON.stringify(http));

	//console.log("req.accepts " + req.accepts);
	//console.log(jsonData);
	//console.dir(req);
	if (req.method.toLowerCase() == "get") {
		getJsonObject("source.json", function(jsonObject) {
			try {
				if (jsonObject == "error") {
					console.log("Error has occured!!");
				} else {
					//console.log("jsonObject : " + JSON.stringify(jsonObject));
					//console.log(Object.keys(jsonObject.students).length);
					// if (Object.keys(jsonObject).length == 0) {
					
					if (jsonObject.students.length == 0) {
						//console.log("Query >>>> not present");
						//getRecords();
					} else if (jsonObject.students.length > 0 ) {
						//console.log("Query >>>> present");
						var jsonData = qs.parse(req.url.split('?')[1]);
						
						var filter = jsonData["q"];
						if (!filter) {
							filter = '';
						}

						//console.log("Filter : " + filter);
						var filteredData = filterJSON(jsonObject, filter);
						//console.log("Filtered JSON : " + JSON.stringify(filteredData));

						sortedJson = sortJsonObject("desc", filteredData);
						//console.log("Filtered and Sorted JSON : " + JSON.stringify(sortedJson));
						//console.log("filter : " + filter);

						//apply this filter on the sort json object and return data accordingly.
					}

					//console.dir(req);
					/*
						Check what kind of data does the request wants in form of response.
					*/
					var outputData = "";
					if (req.headers.accept == "text/plain") {
						//console.log("text");
						outputData = generateText(sortedJson);
						//console.log("outputData : " + outputData);
						res.end(outputData);
					} else if (req.headers.accept == "application/xml") {
						//console.log("xml");
						outputData = generateXML(sortedJson);
						//console.log("outputData : " + outputData);
						res.end(outputData);
					} else if (req.headers.accept == "application/json") {
						//console.log("json");
						outputData = generateJSON(sortedJson);
						res.end(JSON.stringify(outputData));
					} else {
						res.end("Requested response type format is not supported currently!!");
					}
					
					// sortedJson = sortJsonObject("desc", jsonObject);
					// writeToText(sortedJson, function(result) {
					// 	console.log(result);
					// });
					// writeToXML(sortedJson, function(result) {
					// 	console.log(result);
					// });
				}
			} catch (exp) {
				res.end(exp);
			}

		});
	}

}

function filterJSON(jsonObject, filter) {
	console.log("[index.js] >> [filterJSON]");
	var i = 0, output = [];
	//jsonObject.students
	//console.log("Student Objects  : " + jsonObject);

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

	// for (var key in jsonObject) {
	// 	if (jsonObject.hasOwnProperty(key)) {
	// 		if ((jsonObject['fName'].indexof(filter) < -1) || (jsonObject['lName'].indexof(filter) < -1)) {
	// 			output.push({
	// 				"id" : jsonObject["id"],
	// 				"fName" : sonObject["fName"],
	// 				"lName" : sonObject["lName"],
	// 				"score" : sonObject["score"]
	// 			})
	// 		};
	// 	};
	// }

//	console.log("Filtered data : " + JSON.stringify(output));
	return  output || '';
}

function getJsonObject(filepath, cb) {
	console.log("[index.js] >> [getJsonObject]");
	fs.exists(filepath, function(doesExist) {
		if (doesExist) {
			fs.readFile("source.json", 'utf8', function(err,data) {
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
	}
	return jsonObject;
}

function generateXML(jsonObject) {
	console.log("[index.js] >> [generateXML]");
	//console.log("jsonObject : " + JSON.stringify(jsonObject));
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

function generateText(jsonObject) {
	console.log("[index.js] >> [generateText]");
	var output = null;
	output = ("ID\t\tFirst Name\t\tLast Name\t\tScore\n");
	for (var i = 0; i < jsonObject.length; i++) {
		output += jsonObject[i].id + "\t\t" + jsonObject[i].fname + "\t\t\t" + jsonObject[i].lname  + "\t\t\t" + jsonObject[i].score + "\n";
	}
	
	return output || "";
}

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
