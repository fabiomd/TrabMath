var keystone = require('keystone'),
    mongoose = require('mongoose'),
    Teachers = keystone.list('User'),
    errorMap = require('./errorMap.js'),
    successMap = require('./successMap.js');

exports.addTeacher = function(req, res, next) {
  if(!req.body.name){
    return errorMap.getError(res,305,{require : ['name']});
  }

  if(!req.body.email){
    return errorMap.getError(res,305,{require : ['email']});
  }

  if(!req.body.cpf){
    return errorMap.getError(res,305,{require : ['cpf']});
  }

  if(!req.body.password){
    return errorMap.getError(res,305,{require : ['password']});
  }

  if(!req.body.formation){
    return errorMap.getError(res,305,{require : ['formation']});
  }
  
  Teachers.model.findOne({email : req.body.email}).exec(function(err,teacher){
    if(err)
      return errorMap.getError(res,301,{err: err, model : 'Teacher'});
    if(teacher)
      return successMap.getSuccess(res,311,{ message: "Professor ja cadastrado"});
    var newTeacher = new Teachers.model({
        name : req.body.name,
        email: req.body.email,
        cpf  : req.body.cpf,
        password : req.body.password,
        formation: req.body.formation,
        isAdmin : true
    });
    newTeacher._req_user = req.user;
    newTeacher.save(function (err) {
      if (err) 
        return errorMap.getError(res,301,{err: err, model : 'Teacher'});
      return successMap.getSuccess(res,314,{model : 'User', modelID : req.user.id});
    });
  });
}

/** * Get List of News */ 
exports.getTeachers = function(req, res) { 
  Teachers.model.find().sort({'name' : 'asc'}).exec(function(err, items) { 
    if (err) 
      return errorMap.getError(res,301,{err: err, model : 'Teachers'});
      return successMap.getSuccess(res,310,{model : 'Teachers', items: items});   
  }); 
}

exports.getTeacherById = function(req, res) { 
  if(mongoose.Types.ObjectId.isValid(req.params.id)){ 
    Teachers.model.findById(req.params.id).exec(function(err, teacher) { 
      if (err) 
        return errorMap.getError(res,301,{err: err, model : 'Teachers'});
      if (!teacher) 
        return errorMap.getError(res,300,{model: 'Teachers'});
      var tempTeacher = {
        name : teacher.name ? teacher.name : "",
        email : teacher.email ? teacher.email : "",
        cpf : teacher.cpf ? teacher.cpf : "",
        formation: teacher.formation ? teacher.formation : ""
      }
      return successMap.getSuccess(res,310,{model : 'Teachers', items: tempTeacher});  
    });
  }else{
    return errorMap.getError(res,303,{invalid: ['ID']});
  } 
}

exports.updateTeacher = function(req,res){
  Teachers.model.findById(req.user.id).exec(function(err,teacher){
    if(err)
      return errorMap.getError(res,301,{err: err, model : 'Teachers'});
    if(!teacher)
      return errorMap.getError(res,300,{model: 'Teachers'});
    teacher.name = req.body.name ? req.body.name : teacher.name;
    teacher.formation = req.body.formation ? req.body.formation : teacher.formation;
    teacher.password = req.body.password ? req.body.password : teacher.password;
    teacher.save(function(err2){
      if(err2)
        return errorMap.getError(res,301,{err: err2, model : 'Teachers'});
      return successMap.getSuccess(res,314,{model : 'User', modelID : req.user.id});
    });
  });
}