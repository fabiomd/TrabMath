var keystone = require('keystone'),
	merge = require('merge'),
    response = require('./responseMap.js');

exports.getErrorResponse = function (res,id){
	var successResponse = response.getResponse(false);
	var errorCode = {
		error : this.getErrorCodeFormat(id.reverse())
	}
	var tempResponse = merge(successResponse, errorCode);
	return merge(tempResponse, res);
}

exports.getError = function (id,arguments){
	switch(id){

		// Error
		case 1000:
		if(arguments.err){
			if(arguments.err.message){
				if(arguments.model)
					return arguments.err.message + ". In " + arguments.model;
				return arguments.err.message;
			}
		}
		if(arguments.model)
					return "Undefined internal error. In " + arguments.model;
		return "Undefined internal error";

        // Invalid
        case 1001:
        if(arguments.invalid && arguments.invalid.length > 0){
        	var temp = "";
        	if(arguments.invalid.length > 1){
        		for(var i=0; i<arguments.invalid.length - 1; i++){
        			temp += arguments.invalid[i];
        		    if(i != arguments.invalid.length - 2){
        		    	temp += ", "
        		    }
        		}
				temp += " or " + arguments.invalid[arguments.invalid.length - 1];
		    }else{
		    	temp = arguments.invalid[arguments.invalid.length - 1];
		    }
		    if(arguments.model)
				return "Invalid " + temp + ". In " + arguments.model;
			else
			    return "Invalid " + temp;
	    }
        return "Invalid field";

        // Incorrect
        case 1002:
        if(arguments.incorrect && arguments.incorrect.length > 0){
        	var temp = "";
        	if(arguments.incorrect.length > 1){
        		for(var i=0; i<arguments.incorrect.length - 1; i++){
        			temp += arguments.incorrect[i];
        		    if(i != arguments.incorrect.length - 2){
        		    	temp += ", "
        		    }
        		}
				temp += " or " + arguments.incorrect[arguments.incorrect.length - 1];
		    }else{
		    	temp = arguments.incorrect[arguments.incorrect.length - 1];
		    }
		    return "Incorrect " + temp;
	    }
        return "Incorrect field";

        // Not found
		case 1003:
		if(arguments.model)
			return arguments.model + " not found!";
		return "Not found!";

        // No access 
		case 1004:
		return "No access!";

		case 1005:
		return "You do not have permition!";

		// Incorrect
        case 1006:
        if(arguments.require && arguments.require.length > 0){
        	var temp = "";
        	if(arguments.require.length > 1){
        		for(var i=0; i<arguments.require.length - 1; i++){
        			temp += arguments.require[i];
        		    if(i != arguments.require.length - 2){
        		    	temp += ", "
        		    }
        		}
				temp += " and " + arguments.require[arguments.require.length - 1];
		    }else{
		    	temp = arguments.require[arguments.require.length - 1];
		    }
		    return "Require " + temp;
	    }
        return "Require field";

        // Error not mapped
		default:
		return "Undefined error";
	}
}

exports.getErrorCodeFormat = function (subcodes){
	var code = "";
	subcodes.forEach(function(temp,index){
		if(index != subcodes.length - 1)
			code += temp + ":";
		else
			code += temp;
	});
	return code;
}