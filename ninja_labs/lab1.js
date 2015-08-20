/**
 * Lab NODE1: Your First Node.js Program
 * A flat file contains student records in JSON format. Write a program to parse and process these student records.
 * This lab session involves File IO, Handling of JSON Strings, and XML
 *
 * Part 1:
 * Create a new (free) Git repository in GitHub. Use this repository to commit all the code that you write in this lab session.
 * Assume, there is a JSON file (source.json) that contains student records along with scores of each student.
 * Write a NodeJS program which can read this source.json file. It will then extract the first name, last name, and score for every student from this JSON file.
 * The program should write each record to a output file (destination.txt) 
 * 
 * Part 2:
 * We extend the Part 1 to sort all the students based on their score (descending sort).
 * The program should write the sorted output to the destination.txt file
 * 
 * Part 3:
 * We extend the Part 2 to generate an XML output in the destination.xml file.
 * Note the sequence of records in the generated XML should be in thedescending order of the score.
 * Make sure you use a DOM generation library and do not construct the output XML by simple string concatenations. 
 * The intent here is to learn to use a DOM generation library.
 */

var fs = require('fs');
var js2xmlparser = require('js2xmlparser');

/**
 * Generate data in tabular format from a object.
 */
function generateTabularDataFromObject(sortedObject) {
    'use strict';
    var keys = Object.keys(sortedObject), tabularData = '', temp = '', i = 0, cnt = 0, innerObj = {}, prop = '';
    for (i = 0, cnt = 0; i < sortedObject[keys].length; i = i + 1) {
        innerObj = sortedObject[keys][i];
        if (cnt === 0) {
            for (prop in innerObj) {
                if (innerObj.hasOwnProperty(prop)) {
                    if (prop === 'id') { prop = 'Id'; }
                    if (prop === 'fName') { prop = 'First Name'; }
                    if (prop === 'lName') { prop = 'Last Name'; }
                    if (prop === 'score') { prop = 'Score'; }
                    temp += prop + '   |   ';
                }
            }
            tabularData += temp.slice(0, temp.lastIndexOf('|')) + '\n';
            temp = '';
            cnt = cnt + 1;
        }
        for (prop in innerObj) {
            if (innerObj.hasOwnProperty(prop)) {
                temp += innerObj[prop] + '   |   ';
            }
        }
        tabularData += temp.slice(0, temp.lastIndexOf('|')) + '\n';
        temp = '';
    }
    return tabularData;
}

/**
 * Write contents of 'text' -(second parameter) into the specified fileName (first parameter).
 */
function writeToFile(fileName, text) {
    'use strict';
    fs.writeFile(fileName, text, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('The file was saved successfully with name ' + fileName + '!');
        }
    });
}

/**
 * Order the array - (first parameter) according to the column Name - (second parameter)
 * and in specified order - (third parameter).
 */
function orderArray(jsonArray, colName, order) {
    'use strict';
    var testData = [], sortedArray = [], i = 0, j = 0;

    //create array of column data to be sorted.
    for (i = 0; i < jsonArray.length; i = i + 1) {
        testData.push(jsonArray[i][colName]);
    }
    //Sort the testData column.
    testData = testData.sort(function (a, b) {
        if (order === 'asc') {
            return b - a;
        }
        if (order === 'desc') {
            return a - b;
        }
        return a - b;
    });
    //generate sorted array of objects as per the testData order
    for (i = 0; i < jsonArray.length; i = i + 1) {
        for (j = 0; j < jsonArray.length; j = j + 1) {
            if (jsonArray[j][colName] === testData[i]) {
                sortedArray.push(jsonArray[j]);
            }
        }
    }
    return sortedArray;
}

/**
 * Convert JSON Object into Array of Objects by removing top level object wrapper. 
 */
function convertObjectToArray(jsonObject) {
    'use strict';
    var jsonData, keys, jsonArray;
    jsonData = JSON.parse(jsonObject);
    keys = Object.keys(jsonData);
    jsonArray = jsonData[keys[0]];
    return jsonArray;
}

/**
 * Add a top level object wrapper to array of objects - (first parameter).
 * The top level object name or key Name is the second parameter to the  function.
 */
function convertArrayToObject(array, keyName) {
    'use strict';
    var newObj = {};
    newObj[keyName] = array;
    return newObj;
}

/**
 * Internally call three functions and sorts the JSON Object - (first parameter) according to the 
 * specific column / key name - (second parameter) and in a specific order - (third parameter).
 */
function sortObject(colName, jsonObject, order) {
    'use strict';
    var jsonArray, sortedArray, sortedObject;
    jsonArray = convertObjectToArray(jsonObject);
    sortedArray = orderArray(jsonArray, colName, order);
    sortedObject = convertArrayToObject(sortedArray, 'students');
    return sortedObject;
}

/**
 * Take JSON Object as input and restructure the object so that a proper xml can be 
 * generated from that object.
 */
function generateObjForXMLGeneration(sortedObject) {
    'use strict';
    var newObj, keys, i = 0, prop, propKey, propValue;
    newObj = sortedObject;
    keys = Object.keys(newObj);

    for (i = 0; i < newObj[keys].length; i = i + 1) {
        for (prop in newObj[keys][i]) {
            if (newObj[keys][i].hasOwnProperty(prop)) {
                if (prop === 'id') {
                    propKey = { 'id': newObj[keys][i][prop]};
                    delete newObj[keys][i][prop];
                    newObj[keys][i]['@'] = propKey;
                }
                if (prop === 'fName') {
                    newObj[keys][i].name = newObj[keys][i][prop] + ' ';
                    delete newObj[keys][i][prop];
                }
                if (prop === 'lName') {
                    newObj[keys][i].name += newObj[keys][i][prop];
                    delete newObj[keys][i][prop];
                }
                if (prop === 'score') {
                    propValue = newObj[keys][i][prop];
                    delete newObj[keys][i][prop];
                    newObj[keys][i].score = propValue;
                }
            }
        }
    }
    return newObj[keys];
}

/**
 * Take JSON Object which is restructured as per the requirement of the js2xmlparser library.
 * Generate a proper xml from the JSON object - (first parameter).
 */
function generateXML(fileName, newObjForXML) {
    'use strict';
    var options = {
        arrayMap: {
            'students': 'student'
        }
    };
    writeToFile(fileName, js2xmlparser('students', newObjForXML, options));
}

/**
 * Main Entry Point of the Assignment. 
 * Take JSON file - (first parameter) as input and generate destination.txt and destination.xml file .
 */
fs.readFile('source.json', function (err, jsonBufferedObject) {
    'use strict';
    var sortedObject, sortedtext, newObjForXML;
    if (err) {
        throw 'Specified file either not found or cannot be opened' + err;
    }
    sortedObject = sortObject('score', jsonBufferedObject.toString(), 'asc');
    sortedtext = generateTabularDataFromObject(sortedObject);
    writeToFile('destination.txt', sortedtext);
    newObjForXML = generateObjForXMLGeneration(sortedObject);
    generateXML('destination.xml', newObjForXML);
});
