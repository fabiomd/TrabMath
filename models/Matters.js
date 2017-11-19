var keystone = require('keystone'),
    types = keystone.Field.Types;

var Matters = new keystone.List('Matters',{
	autokey: {path: 'slug', from: 'name', unique:true},
    map: {name : 'name'},
	track: true,
	schema: {collection: 'matters'},
    singular : 'matéria',
    plural : 'matérias',
    label:'Matérias'
});

Matters.add({
    name: { type: String, initial:true,  require:true, unique:true, label:'Nome'},
	description: { type: String, initial:true,  label:'Descrição'},
    shift: { type: types.Select, options: 'morning, afternoon, night', default: 'morning'},
    workload: {type: Number,initial :true, require:true, label:'Carga horária'},
    teacher:  {type: types.Relationship, ref: 'User', many:false, initial:true, label:'Professor'},
});

Matters.defaultSort = '-createdAt';
Matters.defaultColumns = 'name';
Matters.schema.set('toJSON', {
     transform: function (doc, ret, options) {
         ret.id = ret._id;
         delete ret._id;
         delete ret.__v;
         delete ret.description;
         delete ret.workload;
         delete ret.teacher;
         delete ret.shift;
         delete ret.updatedBy;
         delete ret.updatedAt;
         delete ret.createdBy;
         delete ret.createdAt;
         delete ret.slug;
     }
});

Matters.defaultColumns = 'name';
Matters.register();