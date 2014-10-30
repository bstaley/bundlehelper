

//-- Exports----------------------------------------------------------------

/**
 * Gets information inside of tags present in an xml file.
 * @param   {string}    rawFileData - Required. Raw data from the file.
 * @param   {string}    splitBy - Required. How to split for each line.
 * @param   {string}    tagName - Required. The name of the tag you want info from.
 **/
exports.getTagInfo = function (rawFileData, splitBy, tagName) {
    var dataContainer = [];
    var fileData = rawFileData.split(splitBy);
    tagName = tagName.replace('<', '').replace('>', '');

    for (var line = 0; line < fileData.length; line++) {
        var currentLine = fileData[line].trim();
        if (currentLine.indexOf('<' + tagName) !== -1) {
            dataContainer.push(currentLine.replace(/<\//g, '').replace(/>/g, '').replace(/</g,'').replace(new RegExp(tagName,'g'),''));
        }
    }

    return dataContainer;
}


//-- Local Logic------------------------------------------------------------
