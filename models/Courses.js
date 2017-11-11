var keystone = require('keystone'),
    types = keystone.Field.Types;

var Courses = new keystone.List('Courses',{
	autokey: {path: 'slug', from: 'name', unique:true},
    map: {name : 'name'},
	track: true,
	schema: {collection: 'courses'},
    singular : 'curso',
    plural : 'cursos',
    label:'Cursos'
});

Courses.add({
    name: { type: String, initial:true,  require:true, unique:true, label:'Nome'},
	description: { type: String, initial:true,  label:'Descrição'},
    duration: {type: Number,initial :true, require:true, unique:true, label:'Duração'},
    matters:  {type: types.Relationship, ref: 'Matters', many:true, initial:true, label:'Matérias'},
});

Courses.defaultSort = '-createdAt';
Courses.defaultColumns = 'name';
Courses.schema.set('toJSON', {
     transform: function (doc, ret, options) {
         ret.id = ret._id;
         delete ret._id;
         delete ret.__v;
         delete ret.description;
         delete ret.duration;
         delete ret.matters;
         delete ret.updatedBy;
         delete ret.updatedAt;
         delete ret.createdBy;
         delete ret.createdAt;
         delete ret.slug;
     }
});

Courses.defaultColumns = 'name';
Courses.register();