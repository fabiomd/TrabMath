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

  if(!req.body.shift){
    return errorMap.getError(res,305,{require : ['shift']});
  }

  var validShift = ['morning','afternoon','night'];
  var i=0;
  for(i=0;i<validShift.length;i++){
    if(validShift[i] == req.body.shift)
      break;
  }
  if(i < validShift.length)
    return errorMap.getError(res,303,{invalid: ['shift']});

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
            shift : req.body.shift,
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
          return errorMap.getError(res,300,{model: 'Teacher'});
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
        shift : item.shift,
        workload : item.workload,
        teacher : item.teacher
      }
      return successMap.getSuccess(res,310,{model : 'Matters', items: tempMatter});  
    });
  }else{
    return errorMap.getError(res,303,{invalid: ['ID']});
  }
}

exports.getMatterByTeacherId = function(req, res) { 
  if(mongoose.Types.ObjectId.isValid(req.params.id)){ 
    Matters.model.find({'teacher':req.params.id}).exec(function(err, items) { 
      if (err) 
        return errorMap.getError(res,301,{err: err, model : 'Matters'});
      return successMap.getSuccess(res,310,{model : 'Matters', items: items});    
    });
  }else{
    return errorMap.getError(res,303,{invalid: ['ID']});
  }
}  

exports.getMatterBySignedTeacher = function(req, res) { 
  if(mongoose.Types.ObjectId.isValid(req.user.id)){ 
    Matters.model.find({'teacher':req.user.id}).exec(function(err, items) { 
      if (err) 
        return errorMap.getError(res,301,{err: err, model : 'Matters'});
      return successMap.getSuccess(res,310,{model : 'Matters', items: items});    
    });
  }else{
    return errorMap.getError(res,303,{invalid: ['ID']});
  }
}

exports.getMatterBySignedTeacherAndShift = function(req, res) { 
  if(mongoose.Types.ObjectId.isValid(req.user.id)){
    if(!req.params.shift)
      return errorMap.getError(res,305,{require : ['shift']});
    var validShift = ['morning','afternoon','night'];
    var i=0;
    for(i=0;i<validShift.length;i++){
      if(validShift[i] == req.params.shift)
        break;
    }
    if(i == validShift.length)
      return errorMap.getError(res,303,{invalid: ['shift']}); 
    Matters.model.find({'teacher':req.user.id}).exec(function(err, items) { 
      if (err) 
        return errorMap.getError(res,301,{err: err, model : 'Matters'});
      var temp = [];
      items.forEach(function(item,index){
        if(item.shift == req.params.shift)
          temp.push(item);
      })
      return successMap.getSuccess(res,310,{model : 'Matters', items: temp});    
    });
  }else{
    return errorMap.getError(res,303,{invalid: ['ID']});
  }
}

exports.updateMatter = function(req,res){
  if(!mongoose.Types.ObjectId.isValid(req.body.id))
    return errorMap.getError(res,303,{invalid: ['ID']});
  if(req.body.teacher && !mongoose.Types.ObjectId.isValid(req.body.teacher))
    return errorMap.getError(res,303,{invalid: ['ID']});  

  Matters.model.findById(req.body.id).exec(function(err,matter){
    if(err)
      return errorMap.getError(res,301,{err: err, model : 'Matters'});
    if(!matter)
      return errorMap.getError(res,300,{model: 'Matters'});
    matter.name = req.body.name ? req.body.name : matter.name;
    matter.description = req.body.description ? req.body.description : matter.description;
    matter.workload = req.body.workload ? req.body.workload : matter.workload;
    matter.teacher = req.body.teacher ? req.body.teacher : matter.teacher;
    matter.save(function(err2){
      if(err2)
        return errorMap.getError(res,301,{err: err2, model : 'Matters'});
      return successMap.getSuccess(res,314,{model : 'User', modelID : req.user.id});
    });
  });
}
