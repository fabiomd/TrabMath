var keystone = require('keystone'),
    moment = require('moment'),
    types = keystone.Field.Types;

var Presencecontrol = new keystone.List('Presencecontrol',{
	// autokey: {path: 'slug', from: 'name', unique:true},
    // map: {name : 'name'},
	track: true,
	schema: {collection: 'presencecontrol'},
    singular : 'controle de presença',
    plural : 'controle de presença',
    label:'Controle de presença'
});

Presencecontrol.add({
    teacher:  {type: types.Relationship, ref: 'User', many:false, initial:true, label:'Professor'},
    matter :  {type: types.Relationship, ref: 'Matters', many:false, initial:true, label:'Matérias'},
    presentStudents: {type: types.Relationship, ref: 'Students', many:true, initial:true, label:'Estudantes presentes'},
    missingStudents: {type: types.Relationship, ref: 'Students', many:true, initial:true, label:'Estudantes faltantes'},
    date:    {type: types.Date, initial:true, require:true, default: moment().format('YYYY MM DD'), label:'Data da chamada'},
});

Presencecontrol.defaultSort = '-createdAt';
Presencecontrol.defaultColumns = 'name';
Presencecontrol.schema.set('toJSON', {
     transform: function (doc, ret, options) {
         ret.id = ret._id;
         delete ret._id;
         delete ret.__v;
         if(ret.date)
            ret.date = (ret.date.getMonth()+1)+'/'+ret.date.getDate()+'/'+ret.date.getFullYear();
         delete ret.formation;
         delete ret.updatedBy;
         delete ret.updatedAt;
         delete ret.createdBy;
         delete ret.createdAt;
         delete ret.slug;
     }
});

Presencecontrol.defaultColumns = 'name';
Presencecontrol.register();