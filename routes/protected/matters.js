var keystone = require('keystone'),
    mongoose = require('mongoose'),
    Courses = keystone.list('Courses'),
    Matters = keystone.list('Matters'),
    Teachers = keystone.list('User'),
    errorMap = require('./errorMap.js'),
    successMap = require('./successMap.js');

exports.addMatter = function(req, res, next) {
  if(!req.body.name){
    return errorMap.getError(res,305,{require : ['name']});
  }

  if(!req.body.description){
    return errorMap.getError(res,305,{require : ['description']});
  }

  if(!req.body.workload){
    return errorMap.getError(res,305,{require : ['workload']});
  }

  if(!req.body.teacher){
    return errorMap.getError(res,305,{require : ['teacher']});
  }

  Matters.model.findOne({name : req.body.name}).exec(function(err,matter){
    if(err)
      return errorMap.getError(res,301,{err: err, model : 'Matter'});
    if(matter)
      return errorMap.getError(res,300,{model: 'Matter'});

    if(mongoose.Types.ObjectId.isValid(req.body.teacher)){
      Teachers.model.findById(req.body.teacher).exec(function(err2,teacher){
        if(err2)
          return errorMap.getError(res,301,{err: err2, model : 'Matter'});
        if(teacher){
          var newMatter = new Matters.model({
            name : req.body.name,
            description: req.body.description,
            workload  : parseInt(req.body.workload),
            teacher : req.body.teacher
          });
          
          newMatter._req_user = req.user;
          newMatter.save(function (err) {
            if (err) 
              return errorMap.getError(res,301,{err: err, model : 'Matter'});
            return successMap.getSuccess(res,314,{model : 'User', modelID : req.user.id});
          });
        }else{
          return errorMap.getError(res,300,{model: 'Matter'});
        }
      });
    }else{
      return errorMap.getError(res,303,{invalid: ['ID']});
    }
  });
}

/** * Get List of News */ 
exports.getMatters = function(req, res) { 
  Matters.model.find().sort({'name' : 'desc'}).exec(function(err, items) { 
    if (err) 
      return errorMap.getError(res,301,{err: err, model : 'Matters'});
    return successMap.getSuccess(res,310,{model : 'Matters', items: items});   
  }); 
}

exports.getMatterById = function(req, res) { 
  if(mongoose.Types.ObjectId.isValid(req.params.id)){ 
    Matters.model.findById(req.params.id).exec(function(err, item) { 
      if (err) 
        return errorMap.getError(res,301,{err: err, model : 'Matters'});
      if (!item) 
        return errorMap.getError(res,300,{model: 'Matters'});
      var tempMatter = {
        name : item.name,
        description : item.description,
        workload : item.workload,
        teacher : item.teacher
      }
      return successMap.getSuccess(res,310,{model : 'Matters', items: tempMatter});  
    });
  }else{
    return errorMap.getError(res,303,{invalid: ['ID']});
  } 
}