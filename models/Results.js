var keystone = require('keystone'),
    types = keystone.Field.Types;

var Results = new keystone.List('Results',{
	// autokey: {path: 'slug', from: 'name', unique:true},
 //    map: {name : 'name'},
	track: true,
	schema: {collection: 'result'},
    singular : 'resultado',
    plural : 'resultados',
    label:'Resultado'
});

Results.add({
    student : {type: types.Relationship, ref: 'Students', require : true, many:false, initial:true, label:'Estudant'},
    grade : {type: Number,initial :true, require:true, label:'Nota'},
});

Results.defaultSort = '-createdAt';
Results.defaultColumns = 'name';
Results.schema.set('toJSON', {
     transform: function (doc, ret, options) {
         ret.id = ret._id;
         delete ret._id;
         delete ret.__v;
         delete ret.updatedBy;
         delete ret.updatedAt;
         delete ret.createdBy;
         delete ret.createdAt;
         delete ret.slug;
     }
});

Results.register();