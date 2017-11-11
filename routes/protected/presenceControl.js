var keystone = require('keystone'),
    mongoose = require('mongoose'),
    Teachers = keystone.list('User'),
    Students = keystone.list('Students'),
    Matters  = keystone.list('Matters'),
    async    = require('async'),
    PresenceControl = keystone.list('Presencecontrol'),
    errorMap = require('./errorMap.js'),
    successMap = require('./successMap.js');

exports.getPresence = function(req, res) {  
  PresenceControl.model.find({teacher: req.user.id}).exec(function(err,presenceControl){
    if (err)
      return errorMap.getError(res,301,{err: err, model : 'Presence Control'});
    return successMap.getSuccess(res,310,{model : 'Presence Control', items: presenceControl}); 
  });
}

exports.addPresence = function(req, res, next) {
  if(!req.body.matter){
    return errorMap.getError(res,305,{require : ['matter']});
  }

  if(!req.body.students){
    return errorMap.getError(res,305,{require : ['students']});
  }


  async.map(req.body.students, function (studentID, next1) {
    Students.model.findById(studentID.id).exec(function(err3,student){
      next1(err3, student? true : false);
    });
  },function (err2, results2) {
    if(err2)
      return errorMap.getError(res,301,{err: err2, model : 'Presence Control'});

    if(results2.indexOf(false) != -1)
      return errorMap.getError(res,303,{invalid: ['ID']});
    if(!mongoose.Types.ObjectId.isValid(req.body.matter))
      return errorMap.getError(res,303,{invalid: ['ID']});

    Matters.model.findById(req.body.matter).exec(function(err4,matter){

       if(err4)
        return errorMap.getError(res,301,{err: err4, model : 'Presence Control'});

       if(!matter)
        return successMap.getSuccess(res,311,{ message: "Mateŕia inexistente"});

      var newPresenceControl = new PresenceControl.model({
          teacher: req.user.id,
          matter: req.body.matter,
          presentStudents: [],
          missingStudents: []
      });

      newPresenceControl._req_user = req.user;

      for(var i=0;i<req.body.students.length;i++){
        if(mongoose.Types.ObjectId.isValid(req.body.students[i].id)){
          if(req.body.students[i].present){
            newPresenceControl.presentStudents.push(req.body.students[i].id);
          }else{
            newPresenceControl.missingStudents.push(req.body.students[i].id);
          }
        }else{
          return errorMap.getError(res,303,{invalid: ['ID']});
        }
      }
      
      newPresenceControl._req_user = req.user;

      newPresenceControl.save(function (err) {
        if (err) 
          return errorMap.getError(res,301,{err: err, model : 'Presence Control'});
        return successMap.getSuccess(res,314,{model : 'User', modelID : req.user.id});
      });
    });
  });
}
