﻿

//-- Requires---------------------------------------------------------------


var fs = require('fs');
var exec = require('child_process').exec;


//-- Variables--------------------------------------------------------------


//The data out of the file after the first touch
var rawFileData = [];
//The original file names
var fileNames = [];
//The full original file names
var fullFileNames = [];


//-- Exports----------------------------------------------------------------


/**
 * Returns the content of a file.
 * @param   string    source   Required. A path of a file.
 **/
exports.readFile = function (source) {
    fileNames.push(getFileName(source));
    fullFileNames.push(source);
    return fs.readFileSync(source, 'utf8');
};

/**
 * Returns nothing. Pushes all data into rawFileData array. Will recursively search through all directories.
 * @param   string    source   Required. A path of a dir.
 **/
exports.getFilesFromDir = function (source, unlockFiles) {
    var files = fs.readdirSync(source);
    
    for (var i = 0; i < files.length; i++) {
        var filename = files[i];
        //get the stats for the item at the path
        var stats = fs.statSync(source + '\\' + filename);
        
        //if file push it into the collection
        if (stats.isFile()) {
            rawFileData.push(exports.readFile(source + '\\' + filename));
            if (unlockFiles) {
                var cmd = 'attrib -R "' + source + '\\' + filename + '"';
                console.log(' ');
                console.log('Running command: ' + cmd);
                exec(cmd, function (error, stdout, stderr) {
                    if (stdout) { console.log('stdout: ' + stdout); }
                    if (stderr) { console.log('stderr: ' + stderr); }
                    if (error !== null) {
                        console.log('exec error: ' + error);
                    }
                });
            }
        }
        //if directory do a recursive search for more files
        else if (stats.isDirectory()) {
            exports.getFilesFromDir(source + '\\' + filename);
        }
    }
};

/**
 * Writes data out to the cwd.
 * @param   string    path   Required. Output path.
 * @param   object    data   Required. UTF-8 data to write out to file.
 **/
exports.writeFile = function (path,data) {
    fs.writeFile(path, data, function (err) {
        if (err) {
            console.log(err);
        } else {
            //console.log("The file was saved to " + process.cwd());
        }
    });
};

/**
 * Returns a name of a file at a specific location.
 * @param   int       index  Required. Location of the file name.
 **/
exports.getFileName = function (index) {
    return fileNames[index];  
};

exports.clearFileData = function () {
    rawFileData = [];
    fileNames = [];
    fullFileNames = [];  
};

/**
 * Returns all names of files.
 **/
exports.getFileNames = function () {
    return fileNames;
};

/**
 * Returns all full names of files.
 **/
exports.getFullFileNames = function () {
    return fullFileNames;
};

/**
 * Returns all read raw files in an array.
 **/
exports.getRawFileData = function () {
    return rawFileData;
};

/**
 * Adds a raw read file to the collection.
 * @param   string   item   Required. Item to add to the local collection.
 **/
exports.pushRawFileData = function (item) { 
    rawFileData.push(item);
};


//-- Local Logic------------------------------------------------------------


/**
 * Splits up a path and pulls the file name from it.
 * @param   string   source   Required. The full file path.
 **/
function getFileName(source) {
    var sourceSplit = source.split('\\');
    return sourceSplit[sourceSplit.length - 1];
}