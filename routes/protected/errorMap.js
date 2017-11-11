var keystone = require('keystone'),
	errorMap = require('../errorMap.js');

exports.getError = function (res,id,arguments){
    var temp = [id];

	switch(id){

        // Not found
		case 300:
		temp.push(1003);
		break;

		// Error message
		case 301:
		temp.push(1000);
		break;

        // Incorrect field
		case 302:
		temp.push(1002);
		break;

		// Invalid field
		case 303:
		temp.push(1001);
		break;

        // No access
		case 304:
		temp.push(1004);
		break;

		// Require field
		case 305:
		temp.push(1006);
		break;
		
	}

	var message = {
		message : errorMap.getError(temp[temp.length - 1],arguments)
	}
	return res.json(errorMap.getErrorResponse(message,temp));
}