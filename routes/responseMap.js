var keystone = require('keystone');

exports.getResponse = function (success){
	return {
		success : success,
		date: new Date()
	}
}