// API to get calendars 
var keystone = require('keystone'), 
	errorMap = require('./errorMap.js'),
    successMap = require('./successMap.js');

/** * Get List of Calendars */ 
exports.checkSession = function(req, res) { 
	if(req.user)
		return successMap.getSuccess(res,111,{message : 'Session OK'}); 
	else
		return successMap.getSuccess(res,111,{message : 'Session expired'}); 
} 

exports.requireUser = function(req, res, next) { 
	if(req.user)
		next(); 
	else
		return errorMap.getError(res,101,{err : {message : 'Session expired'}}); 
} 