// check that the key has been provided in the request body,
// could also be a header

var keystone = require('keystone'),
    errorMap = require('./errorMap.js');

exports.checkPublicKey = function(req, res, next) {
  if (!req.headers['apikey'])
    return errorMap.getError(res,105,{require : ['apikey']});

  if (req.headers['apikey'] === keystone.get('API_KEY')) 
  	return next();
  return errorMap.getError(res,104,{});
}

exports.checkSecretKey = function(req, res, next) {
  if (!req.headers['apisecretkey'])
    return errorMap.getError(res,105,{require : ['apisecretkey']});

  if (req.headers['apisecretkey'] === keystone.get('API_SECRET_KEY')) 
  	return next();
  return errorMap.getError(res,104,{});
}