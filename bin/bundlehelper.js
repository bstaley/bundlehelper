#!/usr/bin/env node


//-- Versioning & License Info----------------------------------------------

//Current Version: 0.1.0

/*
*Check out the site here: https://github.com/bstaley/jsformat
*
*   Copyright 2014 Brandon R Staley
*
*   Licensed under the Apache License, Version 2.0 (the "License");
*   you may not use this file except in compliance with the License.
*   You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
*   Unless required by applicable law or agreed to in writing, software
*   distributed under the License is distributed on an "AS IS" BASIS,
*   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*   See the License for the specific language governing permissions and
*   limitations under the License.
*
*Developed by: Brandon R Staley(bstaley0@gmail.com)
*Date header added: 2013-08-03 10:07am
*Purpose: In combo with WE this prebuild rutine will make sure all of your files are bundled..
*Dependencies: javascript
*Tested on: npm 1.3.14 and node 0.10.22
*Usage: In combo with WE this prebuild rutine will make sure all of your files are bundled..
*Contributers:
*/


//-- TODO-------------------------------------------------------------------



//-- Requires---------------------------------------------------------------


var dialog = require('../lib/dialog.js'),
    file = require('../lib/fileMisc.js'),
    xml = require('../lib/xmlParser.js');


//-- Variables--------------------------------------------------------------


//Holds the switch statements and paths that are user entered.
var userArguments = process.argv.slice(2);
//The location where the .bundle files live.
var bundleLocation = '';
//Used if you point to a directory, this will use recurrsion to find all bundle files.
var root = '';
//How should files be split by line
var split = '\r\n';
//Should we auto write to the file
var autoSync = false;
//Shoul we wait for user input
var allowDialog = false;


//-- Local Logic-----------------------------------------------------------


//parse user arguments
for (var i = 0; i < userArguments.length; i++) {
    switch (userArguments[i]) {
        case '-bundleLoc':
            //get the next piece of info if formatted correctly
            bundleLocation = argsExpectDetail(userArguments[i + 1]);
            i++;
            break;
        case '-root':
            //get the next piece of info if formatted correctly
            root = argsExpectDetail(userArguments[i + 1]);
            i++;
            break;
        case '-split':
            //get the next piece of info if formatted correctly
            split = argsExpectDetail(userArguments[i + 1]);
            i++;
            break;
        case '-autoSync':
            //get the next piece of info if formatted correctly
            autoSync = true;
            break;
        case '-dialog':
            //get the next piece of info if formatted correctly
            allowDialog = true;
            break;
        default:
            console.log('are you lost?');
    }
}

//make sure all requirements are present.
if (!root || !bundleLocation) {
    if (allowDialog) {
        dialog.ask('You did not fill in all the required data(-root  / -bundleLoc). Press enter to exit.', /.*/, function (text) { }, function () { });
    }
    else {
        dialog.logSomething('Failure', 'You did not fill in all the required data(-root / -bundleLoc).Press enter to exit.');
    }
}

//list the args
dialog.logSomething('User Args:', userArguments);

//get all the bundle files
file.getFilesFromDir(root + bundleLocation, true);

//store the names and data
var fileNames = file.getFileNames();
var fileData = file.getRawFileData();

//will store the data found in the xml
var tagInfo = [];

//looking for the custom tag we put in.
dialog.logSomething('Parsing Bundle Files For Tag:', 'sourceFolder');

for (var i = 0; i < fileData.length; i++) {
    //splits the file and looks for data inside our tags
    var tagData = xml.getTagInfo(fileData[i], split, 'sourceFolder');
    tagInfo.push(tagData);
    
    //tell the user what we found
    if (tagData.length) {
        dialog.logSomething(fileNames[i] + ' Result:', tagData.length + ' result(s) found.');
    }
    else {
        dialog.logSomething(fileNames[i] + ' Result:', 'No results found.');
    }
}

//all missing files from each bundle
var allMissingFiles = [];

//go through the bundle info to see if anything is missing
for (var i = 0; i < tagInfo.length; i++) {
    //place to store the missing files for each bundle
    var missingFiles = [];
    //can we even check
    if (tagInfo[i].length) {
        //turn the bundle info into a string to use indexOf
        var tagData = xml.getTagInfo(fileData[i], '\r\n', 'file').toString();
        
        //check each file name to make sure it exist in the bundle file.
        for (var z = 0; z < tagInfo[i].length; z++) {
            //clear the old data
            file.clearFileData();
            //get the script or css file names
            file.getFilesFromDir(root + tagInfo[i][z]);
            //we want the full path
            var scriptFileNames = file.getFullFileNames();
            
            //compare to see if it exist
            for (var x = 0; x < scriptFileNames.length; x++) {
                //we need to cut the name from the full path
                var cutName = scriptFileNames[x].replace(root, '').replace(/\\/g, '/');
                if (tagData.indexOf(cutName) === -1) {
                    // if it is missing add it to the missing list.
                    missingFiles.push(cutName);
                }
            }
        }
        
    }
    
    //each array needs its data
    allMissingFiles.push(missingFiles);
    
    //alert which bundles have missing files
    if (missingFiles.length) {
        dialog.logSomething(fileNames[i] + ' Is Missing File(s):', missingFiles);
    }

}

//should we auto write
if (autoSync) {
    dialog.logSomething('Sync complete', syncFile());
}
//if not should we show a dialog 
else if (allowDialog) {
    dialog.ask('Should I add them to the bundle definition?(y/n)', /.*/, function (text) {
        if (text.toLowerCase() === 'y') {
            return syncFile();
        }
        else {
            return 'Ok. Please press enter to exit.';
        }
    }, function () { });
}

/**
 * Used if the data coming from the CLI is expect to have data associated with it.
 * @param   string    argDetail     Required. The supposed detail.
 **/
function argsExpectDetail(argDetail) {
    if (argDetail) {
        if (argDetail.charAt(0) !== '-') {
            return argDetail;
        }
        else { console.log("failed at firstChar:" + argDetail.charAt(0) + ";"); return undefined; }
    }
    else { console.log('failed at arg:' + argDetail + ";"); return undefined; }
}

/**
 * Used to write to the bundle file.
 **/
function syncFile() {
    var insertAtText = '<files>';
    
    for (var i = 0; i < allMissingFiles.length; i++) {
        if (allMissingFiles[i].length) {
            var missingText = '';
            
            for (var x = 0; x < allMissingFiles[i].length; x++) {
                missingText += split + '    <file>/' + allMissingFiles[i][x] + '</file>';
            }
            var index = fileData[i].indexOf(insertAtText);
            fileData[i] = fileData[i].slice(0, (index + insertAtText.length)) + missingText + fileData[i].slice((index + insertAtText.length));
            var fullPath = root + bundleLocation + fileNames[i];
            dialog.logSomething('Writing to location', fullPath);
            file.writeFile(fullPath, fileData[i]);
        }
    }
    
    return ('And done.' + ((allowDialog)?' Please press enter to exit.':''));
}