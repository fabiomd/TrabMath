var keystone = require('keystone'),
    mongoose = require('mongoose'),
    Assessments = keystone.list('Assessments'),
    Results = keystone.list('Results'),
    Students = keystone.list('Students'),
    Matters  = keystone.list('Matters'),
    PresenceControl = keystone.list('Presencecontrol'),
    async = require('async'),
    errorMap = require('./errorMap.js'),
    successMap = require('./successMap.js');

exports.getAssessmentsByMatter= function(req, res) {
  if(!req.params.id){
    return errorMap.getError(res,305,{require : ['id']});
  }
  if(mongoose.Types.ObjectId.isValid(req.params.id)){  
    Assessments.model.find({matter: req.params.id}).exec(function(err,assessments){
      if (err)
        return errorMap.getError(res,301,{err: err, model : 'Assessments'});
      if(assessments){
        async.map(assessments, function (assessment, next1) {
          async.map(assessment.results, function (result, next2) {
            Results.model.findById(result).exec(function(err3,results){
              if(results){
                Students.model.findById(results.student).exec(function(err4,student){
                  var tempGrade = {
                    name: student.name,
                    grade : results.grade
                  }
                  next2(err3,tempGrade);
                });
              }else{
                var tempGrade = {
                  name: "",
                  grade : ""
                }
                next2(err3,tempGrade);
              }
            });
          },function (err2, results2) {
            Matters.model.findById(assessment.matter).exec(function(err4,matter){
              var tempAssesment;
              if(matter){
                tempAssesment = {
                  name: assessment.name,
                  description : assessment.description,
                  results : results2,
                  matters : matter
                };
              }
              else{
                tempAssesment = {
                  name: assessment.name,
                  description : assessment.description,
                  results : results2,
                  matters : ""
                };
              }
              next1(err2,tempAssesment);
            });
          });
        },function (err1, results1) {
            if(err1)
              return errorMap.getError(res,301,{err: err1, model : 'Assessments'});
            return successMap.getSuccess(res,310,{model : 'Assessments', items: results1});
        });
      }else{
        return successMap.getSuccess(res,310,{model : 'Assessments', items: []}); 
      }
    });
  }else{
    return errorMap.getError(res,303,{invalid: ['ID']});
  } 
}

exports.addAssessment = function(req, res, next) {
  if(!req.body.name){
    return errorMap.getError(res,305,{require : ['name']});
  }

  if(!req.body.description){
    return errorMap.getError(res,305,{require : ['description']});
  }

  if(!req.body.matter){
    return errorMap.getError(res,305,{require : ['matter']});
  }

  if(!req.body.grades){
    return errorMap.getError(res,305,{require : ['student']});
  }

  Matters.model.findById(req.body.matter).exec(function(err,matter){
    if(err)
      return errorMap.getError(res,301,{err: err, model : 'Assessments'});

    if(matter){
      async.map(req.body.grades, function (grade, next) {
        var newResult = new Results.model({
          student : grade.student,
          grade : grade.grade
        });
        newResult.save(function(saveErr){
          next(err,newResult.id);
        });
      },function (err, results) {
        var newAssessment = new Assessments.model({
          name : req.body.name,
          description : req.body.description,
          results : results,
          matter : matter.id
        });

        newAssessment.save(function(saveErr2){
          if(saveErr2)
            return errorMap.getError(res,301,{err: saveErr2, model : 'Assessments'});
          return successMap.getSuccess(res,314,{model : 'User', modelID : req.user.id});
        });
      });
    }else{
      return errorMap.getError(res,300,{model: 'Matter'});
    }
  });
}
