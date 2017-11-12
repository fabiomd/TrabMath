var keystone = require('keystone'),
    mongoose = require('mongoose'),
    Students = keystone.list('Students'),
    Matters  = keystone.list('Matters'),
    errorMap = require('./errorMap.js'),
    successMap = require('./successMap.js');

exports.addStudent = function(req, res, next) {
  if(!req.body.name){
    return errorMap.getError(res,305,{require : ['name']});
  }

  if(!req.body.cpf){
    return errorMap.getError(res,305,{require : ['cpf']});
  }

  if(!req.body.matters){
    return errorMap.getError(res,305,{require : ['matters']});
  }
  
  Students.model.findOne({cpf : req.body.cpf}).exec(function(err,estudent){
    if(err)
      return errorMap.getError(res,301,{err: err, model : 'Estudent'});
    if(estudent){
      for(var i=0;i<req.body.matters.length;i++){
        estudent.matters.push(req.body.matters[i]);
      }

      estudent.save(function (err) {
        if (err) 
          return errorMap.getError(res,301,{err: err, model : 'Estudent'});
        return successMap.getSuccess(res,314,{model : 'User', modelID : req.user.id});
      });
    }else{
      var newStudent = new Students.model({
          name : req.body.name,
          cpf  : req.body.cpf
      });

      for(var i=0;i<req.body.matters.length;i++){
        newStudent.matters.push(req.body.matters[i]);
      }

      newStudent._req_user = req.user;
      newStudent.save(function (err) {
        if (err) 
          return errorMap.getError(res,301,{err: err, model : 'Estudent'});
        return successMap.getSuccess(res,314,{model : 'User', modelID : req.user.id});
      });
    }
  });
}

/** * Get List of News */ 
exports.getStudents = function(req, res) {
  Students.model.find().sort({'name' : 'desc'}).exec(function(err, items) { 
    if (err) 
      return errorMap.getError(res,301,{err: err, model : 'Students'});
    return successMap.getSuccess(res,310,{model : 'Students', items: items});   
  }); 
}

exports.getStudentsByMatter = function(req, res) { 
  if(!req.params.id){
    return errorMap.getError(res,305,{require : ['id']});
  }
  if(mongoose.Types.ObjectId.isValid(req.params.id)){
    Students.model.find().sort({'name' : 'desc'}).exec(function(err, items) { 
      if (err) 
        return errorMap.getError(res,301,{err: err, model : 'Students'});
      Matters.model.findById(req.params.id).exec(function(err2,matter){
        if (err2) 
          return errorMap.getError(res,301,{err: err2, model : 'Students'});
        var tempStudents = [];
        if(matter){
          items.forEach(function(student,index){
            if(student.matters.indexOf(matter.id) != -1)
              tempStudents.push(student);
          });
        }
        return successMap.getSuccess(res,310,{model : 'Students', items: tempStudents});  
      }); 
    }); 
  }else{
    return errorMap.getError(res,303,{invalid: ['ID']});
  }   
}

exports.getStudentById = function(req, res) { 
  if(mongoose.Types.ObjectId.isValid(req.params.id)){ 
    Students.model.findById(req.params.id).exec(function(err, item) { 
      if (err) 
        return errorMap.getError(res,301,{err: err, model : 'Students'});
      if (!item) 
        return errorMap.getError(res,300,{model: 'Students'});
      var tempEstudant = {
        name : item.name ? item.name : "",
        cpf : item.cpf ? item.cpf : "",
        matters : item.matters ? item.matters : []
      }
      return successMap.getSuccess(res,310,{model : 'Students', items: tempEstudant});  
    });
  }else{
    return errorMap.getError(res,303,{invalid: ['ID']});
  } 
}

exports.addMatter = function(req,res){
  if(!req.body.studentid){
    return errorMap.getError(res,305,{require : ['studentid']});
  }

  if(!req.body.matterid){
    return errorMap.getError(res,305,{require : ['matterid']});
  }

  if(!mongoose.Types.ObjectId.isValid(req.body.matterid) || !mongoose.Types.ObjectId.isValid(req.body.studentid))
    return errorMap.getError(res,303,{invalid: ['ID']});

  Students.model.findById(req.body.studentid).exec(function(err,student){
    if(err)
      return errorMap.getError(res,301,{err: err, model : 'Students'});
    if(!student)
      return errorMap.getError(res,300,{model: 'Students'});

    Matters.model.findById(req.body.matterid).exec(function(err2,matter){
      if(err2)
        return errorMap.getError(res,301,{err: err2, model : 'Students'});
      if(matter && student.matters.indexOf(req.body.matterid) == -1){
        student.matters.push(req.body.matterid);
        student.save(function(err3){
          if(err3)
            return errorMap.getError(res,301,{err: err3, model : 'Students'});
          return successMap.getSuccess(res,314,{model : 'User', modelID : req.user.id});
        });
      }else{
        return successMap.getSuccess(res,314,{model : 'User', modelID : req.user.id});
      }
    });
  });
}

exports.rmMatter = function(req,res){
  if(!req.body.studentid){
    return errorMap.getError(res,305,{require : ['studentid']});
  }

  if(!req.body.matterid){
    return errorMap.getError(res,305,{require : ['matterid']});
  }

  if(!mongoose.Types.ObjectId.isValid(req.body.matterid) || !mongoose.Types.ObjectId.isValid(req.body.studentid))
    return errorMap.getError(res,303,{invalid: ['ID']});

  Students.model.findById(req.body.studentid).exec(function(err,student){
    if(err)
      return errorMap.getError(res,301,{err: err, model : 'Students'});
    if(!student)
      return errorMap.getError(res,300,{model: 'Students'});

    Matters.model.findById(req.body.matterid).exec(function(err2,matter){
      if(err2)
        return errorMap.getError(res,301,{err: err2, model : 'Students'});
      if(matter && student.matters.indexOf(req.body.matterid) != -1){
        student.matters.splice(student.matters.indexOf(req.body.matterid), 1);
        student.save(function(err3){
          if(err3)
            return errorMap.getError(res,301,{err: err3, model : 'Students'});
          return successMap.getSuccess(res,314,{model : 'User', modelID : req.user.id});
        });
      }else{
        return successMap.getSuccess(res,314,{model : 'User', modelID : req.user.id});
      }
    });
  });
}