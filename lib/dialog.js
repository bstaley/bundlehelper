﻿

//-- Exports----------------------------------------------------------------

/**
 * Will ask a question and act based on if the users returned data has value or is empty.
 * @param   string    question           Required. Text of a question that the user must answer.
 * @param   regex     format             Required. A regex format that the user's answer must follow.
 * @param   string    callbackContinue   Required. This is the function that will process the text the user entered and MUST return the next quesiton.
 * @param   string    callbackComplete   Optional. Extra functionality you can perform after a user submits a blank line.
 **/
exports.ask = function (question, format, callbackContinue, callbackComplete) {
    var stdin = process.stdin, stdout = process.stdout;
    
    stdin.resume();
    stdout.write(question + ": ");
    
    stdin.once('data', function (data) {
        data = data.toString().trim();
        
        if (format.test(data)) {
            askAgain(data, format, callbackContinue, callbackComplete);
        } else {
            stdout.write("It should match: " + format + "\n");
            exports.ask(question, format, callbackContinue, callbackComplete);
        }
    });
};

//To be removed
exports.logSomething = function(title, data) {
    console.log('');
    console.log(title);
    console.log(data);
}


//-- Local Logic------------------------------------------------------------


/**
 * The logic that handles whether or not to end the line of questioning.
 * @param   string    text               Required. This will be the text returned from the user.
 * @param   regex     format             Required. A regex format that the user's answer must follow.
 * @param   string    callbackContinue   Required. This is the function that will process the text the user entered and MUST return the next quesiton.
 * @param   string    callbackComplete   Optional. Extra functionality you can perform after a user submits a blank line.
 **/
var askAgain = function (text, format, callbackContinue, callbackComplete) {
    if (!text) {
        process.stdin.pause();
        callbackComplete();
    }
    else {
        var question = callbackContinue(text);
        exports.ask(question, format, callbackContinue, callbackComplete);
    }
};