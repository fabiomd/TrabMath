var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views'),
	api : importRoutes('./api'),
	auth : importRoutes('./auth'),
	protected : importRoutes('./protected'),
};

// Setup Route Bindings
exports = module.exports = function (app) {
	// Views
	app.get('/', routes.views.index);

	app.post('/signin' , routes.auth.signin);

	app.get('/signout' , routes.auth.signout);

	app.all('/api*', routes.auth.key.checkPublicKey);

	app.get('/checksession', routes.auth.checkConnection.checkSession);

	app.get('/teachers', routes.auth.checkConnection.requireUser, routes.protected.teachers.getTeachers); 
	app.get('/teacher/:id', routes.auth.checkConnection.requireUser, routes.protected.teachers.getTeacherById);
	app.post('/addteacher', routes.auth.checkConnection.requireUser, routes.protected.teachers.addTeacher);
    app.post('/updateteacher',routes.auth.checkConnection.requireUser, routes.protected.teachers.updateTeacher);

	app.get('/courses', routes.auth.checkConnection.requireUser, routes.protected.course.getCourses); 
	app.get('/course/:id', routes.auth.checkConnection.requireUser, routes.protected.course.getCourseById);
	app.post('/addcourse', routes.auth.checkConnection.requireUser, routes.protected.course.addCourse);
	app.post('/updatecourse', routes.auth.checkConnection.requireUser, routes.protected.course.updateCourse);

	app.get('/matters', routes.auth.checkConnection.requireUser, routes.protected.matters.getMatters); 
	app.get('/matter/:id', routes.auth.checkConnection.requireUser, routes.protected.matters.getMatterById);
	app.post('/addmatter', routes.auth.checkConnection.requireUser, routes.protected.matters.addMatter);
    app.post('/updatematter',routes.auth.checkConnection.requireUser, routes.protected.matters.updateMatter);
    app.get('/mattersbyteacher/:id',routes.auth.checkConnection.requireUser, routes.protected.matters.getMatterByTeacherId);
    app.get('/mattersbysignedteacher',routes.auth.checkConnection.requireUser, routes.protected.matters.getMatterBySignedTeacher);
    app.get('/mattersbysignedteacherandshift/:shift',routes.auth.checkConnection.requireUser, routes.protected.matters.getMatterBySignedTeacherAndShift);

	app.post('/addpresencecontrol', routes.auth.checkConnection.requireUser, routes.protected.presenceControl.addPresence);
	app.get('/presencecontrol',routes.auth.checkConnection.requireUser, routes.protected.presenceControl.getPresence);

    app.get('/students', routes.auth.checkConnection.requireUser, routes.protected.students.getStudents); 
	app.get('/student/:id', routes.auth.checkConnection.requireUser, routes.protected.students.getStudentById);
	app.get('/studentsbymatter/:id', routes.auth.checkConnection.requireUser, routes.protected.students.getStudentsByMatter);
	app.post('/addstudent', routes.auth.checkConnection.requireUser, routes.protected.students.addStudent);
	app.post('/addmattertostudent', routes.auth.checkConnection.requireUser, routes.protected.students.addMatter);
	app.post('/rmmattertostudent', routes.auth.checkConnection.requireUser, routes.protected.students.rmMatter);

	app.get('/assessmentsbymatter/:id', routes.auth.checkConnection.requireUser, routes.protected.assessments.getAssessmentsByMatter);
	app.post('/addassessments', routes.auth.checkConnection.requireUser, routes.protected.assessments.addAssessment);
};
