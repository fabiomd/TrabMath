var keystone = require('keystone'), 
	Teachers = keystone.list('User'),
	errorMap = require('./errorMap.js'),
    successMap = require('./successMap.js'),
	mongoose = require('mongoose'); 

/** * Get List of News */ 
exports.getTeachers = function(req, res) { 
	Teachers.model.find({featured : true}).sort({'name' : 'desc'}).exec(function(err, items) { 
		if (err) 
			return errorMap.getError(res,201,{err: err, model : 'Teachers'});
	    return successMap.getSuccess(res,210,{model : 'Teachers', items: items});   
	}); 
}

exports.getTeacherById = function(req, res) { 
	if(mongoose.Types.ObjectId.isValid(req.params.id)){ 
		Teachers.model.findById(req.params.id).exec(function(err, item) { 
			if (err) 
				return errorMap.getError(res,201,{err: err, model : 'Teachers'});
			if (!item) 
				return errorMap.getError(res,200,{model: 'Teachers'});
			var tempTeacher = {
				name : item.name,
				cpf : item.cpf,
				formation: item.formation
			}
			return successMap.getSuccess(res,210,{model : 'Teachers', items: tempTeacher});  
		});
	}else{
		return errorMap.getError(res,203,{invalid: ['ID']});
	} 
}