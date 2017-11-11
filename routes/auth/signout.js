var keystone = require('keystone'),
	successMap = require('./successMap.js');

exports = module.exports = function (req, res) {
  keystone.session.signout(req, res, function() {
  	return successMap.getSuccess(res,-1,{});
  });
}

