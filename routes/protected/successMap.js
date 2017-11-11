var keystone = require('keystone'),
	successMap = require('../successMap.js');

exports.getSuccess = function (res,id,arguments){
    var successResponse = successMap.getSuccessResponse();

	switch(id){

		case 310:
		var tempResponse = {};
		if(arguments.model && arguments.items){
			if(arguments.lastupdate)
				tempResponse["lastupdate"] = arguments.lastupdate;
			tempResponse[arguments.model.toLowerCase()] = arguments.items;
		}
		return res.json(successMap.getSuccessResponse(tempResponse));

        // General message
		case 311:
		var tempResponse = {message : arguments.message};
		return res.json(successMap.getSuccessResponse(tempResponse));

        // Multiple models
		case 313:
		var tempResponse = {};

		if(arguments.models)
			arguments.models.forEach(function(temp,index){
				tempResponse[temp.model.toLowerCase()] = temp.items;
					});
		return res.json(successMap.getSuccessResponse(tempResponse));

		case 314:
		var tempResponse = {};
		if(arguments.model && arguments.modelID){
			tempResponse[arguments.model.toLowerCase() + "ID"] = arguments.modelID;
		}
		if(arguments.points)
			tempResponse['myPoints'] = arguments.points;
		return res.json(successMap.getSuccessResponse(tempResponse));

		// Multiple models without lowerCase
		case 315:
		var tempResponse = {};

		if(arguments.models)
			arguments.models.forEach(function(temp,index){
				tempResponse[temp.model] = temp.items;
					});
		return res.json(successMap.getSuccessResponse(tempResponse));

        // Success not mapped
		default:
		return res.json(successResponse);
	}
}