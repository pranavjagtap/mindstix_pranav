var fs = require('fs');
var js2xml = require('js2xmlparser');
var jsonlint = require('jsonlint');

function getJsonObject(filepath, cb) {
	console.log("[index.js] >> [getJsonObject]");
	fs.exists(filepath, function(doesExist) {
		if (doesExist) {
			fs.readFile("source.json", 'utf8', function(err,data) {
				if (err) { throw err};
				try	{
					data = jsonlint.parse(data);
					cb(data);
				} catch (err) {
					console.log("Please check your JSON file, it has some error. \n\n" + err);
				}
			});
		}
	});
}

function sortJsonObject(sortOrder, jsonObject) {
	console.log("[index.js] >> [sortJsonObject]");
	if (sortOrder === "asc") {
		jsonObject.students.sort(function(a,b) {
			return a.score - b.score;
		});
	} else if (sortOrder === "desc") {
		jsonObject.students.sort(function(a,b) {
			return b.score - a.score;
		});
	}
	return jsonObject;
}

function writeToXML(jsonObject, cb) {
	console.log("[index.js] >> [writeToXML]");
	var newData = {}, student =[], len = jsonObject.students.length;
	for (var i = 0; i < len; i++) {
		student.push({
			"student" : {
				"@" : {
					"id" : jsonObject.students[i].id 
				},
				"name"  : jsonObject.students[i].fname + " " + jsonObject.students[i].lname,
				"score"  : jsonObject.students[i].score,
			}
		});
	}
	newData = {	student };
	if (i == len) {
		fs.writeFile("students.xml", js2xml("students", newData), function (err) {
			if (err) throw cb("ERROR : " + err);
			cb("SUCCESS : Data saved to xml file!");
		});
	} else {
		cb("ERROR : not reached EOF");
	}	
}

function writeToText(jsonObject, cb) {
	console.log("[index.js] >> [writeToText]");
	var output = null;
	output = ("ID\t\tFirst Name\t\tLast Name\t\tScore\n");
	for (var i = 0; i < jsonObject.students.length; i++) {
		output += jsonObject.students[i].id + "\t\t" + jsonObject.students[i].fname + "\t\t\t" + jsonObject.students[i].lname  + "\t\t\t" + jsonObject.students[i].score + "\n";
	}
	fs.writeFile('students.txt', output, function (err) {
		if (err) throw cb("ERROR : " + err);
		cb("SUCCESS : Data saved to text file!");
	});
}

function main() {
	console.log("[index.js] >> [main]");
	var jsonObject = null;
	jsonObject = getJsonObject("source.json", function(jsonObject) {
		sortedJson = sortJsonObject("desc", jsonObject);
		writeToText(sortedJson, function(result) {
			console.log(result);
		});
		writeToXML(sortedJson, function(result) {
			console.log(result);
		});
	});		
}

main();
