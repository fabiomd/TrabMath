var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
var User = new keystone.List('User');

User.add({
	name: { type: String, initial:true, require:true, label:'Nome'},
    cpf: {type: Number,initial :true, require:true, unique:true, label:'CPF'},
    formation: { type: String, initial:true,  require:true, label:'Formação'},
    email: { type: Types.Email, initial: true, required: true, unique: true, index: true },
	password: { type: Types.Password, initial: true, required: true },
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true },
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin;
});

User.schema.set('toJSON', {
     transform: function (doc, ret, options) {
         ret.id = ret._id;
         delete ret._id;
         delete ret.__v;
         delete ret.isAdmin;
         delete ret.password;
         delete ret.cpf;
         delete ret.email;
         delete ret.formation;
         delete ret.updatedBy;
         delete ret.updatedAt;
         delete ret.createdBy;
         delete ret.createdAt;
         delete ret.slug;
     }
});
/**
 * Registration
 */
User.defaultColumns = 'name, email, isAdmin';
User.register();
