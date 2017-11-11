var keystone = require('keystone'),
	successMap = require('../successMap.js');

exports.getSuccess = function (res,id,arguments){
	var successResponse = successMap.getSuccessResponse();

	switch(id){
		// Success with model ID
		case 110:
		var tempResponse = {};
		if(arguments.model && arguments.modelID){
			tempResponse[arguments.model.toLowerCase() + "ID"] = arguments.modelID;
		}
		return res.json(successMap.getSuccessResponse(tempResponse));

		// With message
		case 111:
		var tempResponse = {message : arguments.message};
		return res.json(successMap.getSuccessResponse(tempResponse));

        // Success not mapped
		default:
		return res.json(successResponse);
	}
}