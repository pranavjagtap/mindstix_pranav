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
    var keys = '', tabularData = '', temp = '', i = 0, cnt = 0, innerObj = {}, prop = '';
    try {
        keys = Object.keys(sortedObject);
        for (i = 0, cnt = 0; i < sortedObject[keys].length; i = i + 1) {
            innerObj = sortedObject[keys][i];
            if (cnt === 0) {
                for (prop in innerObj) {
                    if (innerObj.hasOwnProperty(prop)) {
                        if (prop === 'id') {
                            temp += 'Id' + '   |   ';
                        } else if (prop === 'fName') {
                            temp += 'First Name' + '   |   ';
                        } else if (prop === 'lName') {
                            temp += 'Last Name' + '   |   ';
                        } else if (prop === 'score') {
                            temp += 'Score' + '   |   ';
                        } else {
                            throw "[Error: '" + prop + "' is not an unexpected key name in json object.]";
                        }
                    }
                }
                tabularData += temp.slice(0, temp.lastIndexOf('|')) + '\n';
                temp = '';
                cnt = cnt + 1;
            }
            for (prop in innerObj) {
                if (innerObj.hasOwnProperty(prop)) {
                    if (Object.keys(innerObj).length === 4) {
                        if (prop === 'id' || prop === 'fName' || prop === 'lName' || prop === 'score') {
                            temp += innerObj[prop] + '   |   ';
                        } else {
                            throw "[Error: you have miss-spelled a key as '" + prop + "' in JSON Object. Please check the source(input) json file]";
                        }
                    } else {
                        throw "[Error: few keys are missing in JSON Object. Please check the source(input) json file]";
                    }
                } else {
                    throw "[Error: key is missing in JSON Object. Please check the source(input) json file]";
                }
            }
            tabularData += temp.slice(0, temp.lastIndexOf('|')) + '\n';
            temp = '';
        }
    } catch (e) {
        throw e;
    }

    return tabularData;
}

/**
 * Write contents of 'text' -(second parameter) into the specified fileName (first parameter).
 */
function writeToFile(fileName, text) {
    'use strict';
    try {
        fs.writeFile(fileName, text.toString(), function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log('The file was saved successfully with name ' + fileName + '!');
            }
        });
    } catch (e) {
        throw e;
    }
}

/**
 * Order the array - (first parameter) according to the column Name - (second parameter)
 * and in specified order - (third parameter).
 */
function orderArray(jsonArray, colName, order) {
    'use strict';
    var testData = [], sortedArray = [], i = 0, j = 0;

    try {
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
    } catch (e) {
        throw e;
    }
    return sortedArray;
}

/**
 * Convert JSON Object into Array of Objects by removing top level object wrapper. 
 */
function convertObjectToArray(jsonObject) {
    'use strict';
    try {
        var jsonData, keys, jsonArray;
        jsonData = JSON.parse(jsonObject);
        keys = Object.keys(jsonData);
        jsonArray = jsonData[keys[0]];
        return jsonArray;
    } catch (e) {
        throw e;
    }
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
    try {
        var jsonArray, sortedArray, sortedObject;
        jsonArray = convertObjectToArray(jsonObject);
        sortedArray = orderArray(jsonArray, colName, order);
        sortedObject = convertArrayToObject(sortedArray, 'students');
        return sortedObject;
    } catch (e) {
        throw e;
    }
}

/**
 * Take JSON Object as input and restructure the object so that a proper xml can be 
 * generated from that object.
 */
function generateObjForXMLGeneration(sortedObject) {
    'use strict';
    var newObj, keys, i = 0, prop, propKey, propValue;
    try {
        newObj = sortedObject;
        keys = Object.keys(newObj);

        for (i = 0; i < newObj[keys].length; i = i + 1) {
            for (prop in newObj[keys][i]) {
                if (newObj[keys][i].hasOwnProperty(prop)) {
                    if (prop === 'id') {
                        propKey = { 'id': newObj[keys][i][prop]};
                        delete newObj[keys][i][prop];
                        newObj[keys][i]['@'] = propKey;
                    } else if (prop === 'fName') {
                        newObj[keys][i].name = newObj[keys][i][prop] + ' ';
                        delete newObj[keys][i][prop];
                    } else if (prop === 'lName') {
                        newObj[keys][i].name += newObj[keys][i][prop];
                        delete newObj[keys][i][prop];
                    } else if (prop === 'score') {
                        propValue = newObj[keys][i][prop];
                        delete newObj[keys][i][prop];
                        newObj[keys][i].score = propValue;
                    } else {
                        throw "[Error: " + prop + " is an unexpected key name in json object.]";
                    }
                }
            }
        }
    } catch (e) {
        throw e;
    }
    return newObj[keys];
}

/**
 * Take JSON Object which is restructured as per the requirement of the js2xmlparser library.
 * Generate a proper xml from the JSON object - (first parameter).
 */
function generateXML(fileName, newObjForXML) {
    'use strict';
    try {
        var options = {
            arrayMap: {
                'students': 'student'
            }
        };
        writeToFile(fileName, js2xmlparser('students', newObjForXML, options));
    } catch (e) {
        throw e;
    }
}

/**
 * Main Entry Point of the Assignment. 
 * Take JSON file - (first parameter) as input and generate destination.txt and destination.xml file .
 */
fs.readFile('source.json', function (err, jsonBufferedObject) {
    'use strict';
    var sortedObject, sortedtext, newObjForXML;
    try {
        if (err) {
            throw err;
        }
        JSON.parse(jsonBufferedObject);
        sortedObject = sortObject('score', jsonBufferedObject.toString(), 'asc');
        if (sortObject !== null || sortObject !== undefined) {
            sortedtext = generateTabularDataFromObject(sortedObject);
            if (sortedtext !== null || sortedtext !== undefined) {
                writeToFile('destination.txt', sortedtext);
            }
        }
        newObjForXML = generateObjForXMLGeneration(sortedObject);
        if (newObjForXML !== null || newObjForXML !== undefined) {
            generateXML('destination.xml', newObjForXML);
        }
    } catch (e) {
        console.log(e);
    }
});
