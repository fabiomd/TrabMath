var keystone = require('keystone'),
    merge = require('merge'),
    response = require('./responseMap.js');

exports.getSuccessResponse = function (res){
	var successResponse = response.getResponse(true);
	return merge(successResponse, res);
}