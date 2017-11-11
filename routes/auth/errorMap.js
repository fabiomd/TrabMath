var keystone = require('keystone'),
	errorMap = require('../errorMap.js');

exports.getError = function (res,id,arguments){

	var temp = [id];

	switch(id){

        // Not found
		case 100:
		temp.push(1003);
		break;

        // Internal error
		case 101:
		temp.push(1000);
		break;

        // Incorrect field
		case 102:
		temp.push(1002);
		break;

		// Invalid field
		case 103:
		temp.push(1001);
		break;

        // No access
		case 104:
		temp.push(1004);
		break;

		// Require field
		case 105:
		temp.push(1006);
		break;
		
	}

	var message = {
		message : errorMap.getError(temp[temp.length - 1],arguments)
	}
	return res.json(errorMap.getErrorResponse(message,temp));
}