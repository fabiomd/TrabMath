var keystone = require('keystone'),
    types = keystone.Field.Types;

var Assessments = new keystone.List('Assessments',{
	autokey: {path: 'slug', from: 'name', unique:true},
    map: {name : 'name'},
	track: true,
	schema: {collection: 'assessments'},
    singular : 'avaliação',
    plural : 'avaliações',
    label:'Avaliações'
});

Assessments.add({
    name: { type: String, initial:true,  require:true, unique:true, label:'Nome'},
	description: { type: String, initial:true,  label:'Descrição'},
    results: {type: types.Relationship, ref: 'Results', many:true,require: true, initial:true, label:'Resultados'},
    matter: {type: types.Relationship, ref: 'Matters', many:false, require: true,initial:true, label:'Matéria'},
});

Assessments.defaultSort = '-createdAt';
Assessments.defaultColumns = 'name';
Assessments.schema.set('toJSON', {
     transform: function (doc, ret, options) {
         ret.id = ret._id;
         delete ret._id;
         delete ret.__v;
         delete ret.results;
         delete ret.matters;
         delete ret.updatedBy;
         delete ret.updatedAt;
         delete ret.createdBy;
         delete ret.createdAt;
         delete ret.slug;
     }
});

Assessments.defaultColumns = 'name';
Assessments.register();