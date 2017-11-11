var keystone = require('keystone'), 
    errorMap = require('./errorMap.js'),
    successMap = require('./successMap.js');

exports = module.exports = function(req, res) {
 
  if (!req.body.email) 
    return errorMap.getError(res,105,{require : ['email']});
  if (!req.body.password) 
    return errorMap.getError(res,105,{require : ['password']});  
  
  keystone.list('User').model.findOne({ email: req.body.email }).exec(function(err, user) {   

    if (!user)
      return errorMap.getError(res,100,{model : 'User'});

    if (err)
      return errorMap.getError(res,101,{err : err});

    keystone.session.signin({ email: user.email, password: req.body.password }, req, res, function(user) {
      return successMap.getSuccess(res,110,{model : 'User', modelID : user.id});
    }, function(err) {
      return errorMap.getError(res,102,{err : err, incorrect : ['password']});     
    });
  });
}