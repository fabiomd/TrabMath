var keystone = require('keystone'),
	successMap = require('../successMap.js');

exports.getSuccess = function (res,id,arguments){
    var successResponse = successMap.getSuccessResponse();

	switch(id){

		// Model list
		case 210:
		var tempResponse = {};
		if(arguments.model && arguments.items){
			tempResponse[arguments.model.toLowerCase()] = arguments.items;
		}
		return res.apiResponse(successMap.getSuccessResponse(tempResponse));

        // With message
		case 211:
		var tempResponse = {message : arguments.message};
		return res.apiResponse(successMap.getSuccessResponse(tempResponse));

        // Multiple models
		case 213:
		var tempResponse = {};

		if(arguments.models)
			arguments.models.forEach(function(temp,index){
				tempResponse[temp.model.toLowerCase()] = temp.items;
					});
		return res.apiResponse(successMap.getSuccessResponse(tempResponse));

        // Model ID
		case 214:
		var tempResponse = {};
		if(arguments.model && arguments.modelID){
			tempResponse[arguments.model.toLowerCase() + "ID"] = arguments.modelID;
		}
		return res.apiResponse(successMap.getSuccessResponse(tempResponse));

		// Success not mapped
		default:
		return res.apiResponse(successResponse);
	}
}