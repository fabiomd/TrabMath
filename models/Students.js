var keystone = require('keystone'),
    types = keystone.Field.Types;

var Students = new keystone.List('Students',{
	autokey: {path: 'slug', from: 'name', unique:true},
    map: {name : 'name'},
	track: true,
	schema: {collection: 'students'},
    singular : 'estudante',
    plural : 'estudantes',
    label:'Estudantes'
});

Students.add({
    name: { type: String, initial:true,  require:true, unique:true, label:'Nome'},
    cpf: {type: Number,initial :true, require:true, unique:true, label:'CPF'},
    matters:  {type: types.Relationship, ref: 'Matters', many:true, initial:true, label:'Matérias'},
});

Students.defaultSort = '-createdAt';
Students.defaultColumns = 'name';
Students.schema.set('toJSON', {
     transform: function (doc, ret, options) {
         ret.id = ret._id;
         delete ret._id;
         delete ret.__v;
         delete ret.cpf;
         delete ret.matters;
         delete ret.updatedBy;
         delete ret.updatedAt;
         delete ret.createdBy;
         delete ret.createdAt;
         delete ret.slug;
     }
});

Students.defaultColumns = 'name';
Students.register();