var keystone = require('keystone'),
    mongoose = require('mongoose'),
    Courses = keystone.list('Courses'),
    Matters = keystone.list('Matters'),
    errorMap = require('./errorMap.js'),
    successMap = require('./successMap.js');

exports.addCourse = function(req, res, next) {
  if(!req.body.name){
    return errorMap.getError(res,305,{require : ['name']});
  }

  if(!req.body.description){
    return errorMap.getError(res,305,{require : ['description']});
  }

  if(!req.body.duration){
    return errorMap.getError(res,305,{require : ['duration']});
  }

  if(!req.body.matters){
    return errorMap.getError(res,305,{require : ['matters']});
  }

  Courses.model.findOne({name : req.body.name}).exec(function(err,course){
    if(err)
      return errorMap.getError(res,301,{err: err, model : 'Course'});
    if(course){
      for(var i=0;i<req.body.matters.length;i++){
        course.matters.push(req.body.matters[i]);
      }

      course.save(function (err) {
        if (err) 
          return errorMap.getError(res,301,{err: err, model : 'Course'});
        return successMap.getSuccess(res,314,{model : 'User', modelID : req.user.id});
      });
    }else{
      var newCourse = new Courses.model({
          name : req.body.name,
          description: req.body.description,
          duration  : parseInt(req.body.duration),
      });

      for(var i=0;i<req.body.matters.length;i++){
        newCourse.matters.push(req.body.matters[i]);
      }
      newCourse._req_user = req.user;
      newCourse.save(function (err) {
        if (err) 
          return errorMap.getError(res,301,{err: err, model : 'Course'});
        return successMap.getSuccess(res,314,{model : 'User', modelID : req.user.id});
      });
    }
  });
}

/** * Get List of News */ 
exports.getCourses = function(req, res) { 
  Courses.model.find().sort({'name' : 'desc'}).exec(function(err, items) { 
    if (err) 
      return errorMap.getError(res,301,{err: err, model : 'Courses'});
    return successMap.getSuccess(res,310,{model : 'Courses', items: items});   
  }); 
}

exports.getCourseById = function(req, res) { 
  if(mongoose.Types.ObjectId.isValid(req.params.id)){ 
    Courses.model.findById(req.params.id).exec(function(err, item) { 
      if (err) 
        return errorMap.getError(res,301,{err: err, model : 'Courses'});
      if (!item) 
        return errorMap.getError(res,300,{model: 'Courses'});
      var tempCourse = {
        name : item.name,
        description : item.description,
        duration: item.duration,
        matters : item.matters
      }
      return successMap.getSuccess(res,310,{model : 'Courses', items: tempCourse});  
    });
  }else{
    return errorMap.getError(res,303,{invalid: ['ID']});
  } 
}

exports.updateCourse = function(req,res){
  if(!mongoose.Types.ObjectId.isValid(req.body.id))
    return errorMap.getError(res,303,{invalid: ['ID']}); 

  Courses.model.findById(req.body.id).exec(function(err,course){
    if(err)
      return errorMap.getError(res,301,{err: err, model : 'Courses'});
    if(!course)
      return errorMap.getError(res,300,{model: 'Courses'});
    course.name = req.body.name ? req.body.name : course.name;
    course.description = req.body.description ? req.body.description : course.description;
    course.duration = req.body.duration ? req.body.duration : course.duration;
    course.save(function(err2){
      if(err2)
        return errorMap.getError(res,301,{err: err2, model : 'Courses'});
      return successMap.getSuccess(res,314,{model : 'User', modelID : req.user.id});
    });
  });
}
