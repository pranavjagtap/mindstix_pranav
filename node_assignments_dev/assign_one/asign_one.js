var fs = require('fs');
var js2xml = require('js2xmlparser');
var jsonlint = require('jsonlint');

fs.exists("source.json", function(doesExist) {
	/*
		Need to understand the error handling mechanism in callbacks.
		if (err) { throw err };
	*/
	console.log(doesExist ? "yes" : "no");
	if (doesExist) {
		fs.readFile("source.json", 'utf8', function(err,data) {
			if (err) { throw err};
			var  jsonObject = jsonlint.parse(data);
			console.log("ID\t\tFirst Name\t\tLast Name\t\tScore");
			for (var i = 0; i < jsonObject.students.length; i++) {
				console.log(jsonObject.students[i].id + "\t\t" + jsonObject.students[i].fname + "\t\t\t" + jsonObject.students[i].lname  + "\t\t\t" + jsonObject.students[i].score);
			};

			sortJsonObject("desc", jsonObject, function (data) {
				var output = null;
				output = "\n\nID\t\tFirst Name\t\tLast Name\t\tScore\n";
				for (var i = 0; i < jsonObject.students.length; i++) {
					output += jsonObject.students[i].id + "\t\t" + jsonObject.students[i].fname + "\t\t\t" + jsonObject.students[i].lname  + "\t\t\t" + jsonObject.students[i].score + "\n";
				}

				writeToFile('students.txt', output, function (result) {
					console.log("txt writing " + result);
				});

				restructureData(data, function (newData) {
					writeToFile('students.xml', js2xml("students", newData), function (result) {
						console.log("xml writing " + result);
					});
				});
			});
		});
	}
});


function sortJsonObject(sortOrder, jsonObject, cb) {
	if (sortOrder === "asc") {
		jsonObject.students.sort(function(a,b) {
			return a.score - b.score;
		});
	} else if (sortOrder === "desc") {
		jsonObject.students.sort(function(a,b) {
			return b.score - a.score;
		});
	}
	cb(jsonObject);
}

function writeToFile(fName, data, cb) {
	fs.writeFile(fName, data , function (err) {
		if (err) throw cb("ERROR : " + err);
		cb("SUCCESS : It's saved!");
	});
}

function restructureData(jsonObject, cb) {
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
		cb(newData);
	} else {
		cb("ERROR : not reached EOF");
	};
}

