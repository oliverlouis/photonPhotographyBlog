const express = require('express'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	colors = require('colors'),
	Comment = require('./models/comment'),
	Blog = require('./models/blog'),
	User = require('./models/user'),
	methodOverride = require('method-override'),
	passport = require('passport'),
	middleware = require('./middleware'),
	LocalStrategy = require('passport-local'),
	expressSanitizer = require('express-sanitizer'),
	flash = require('connect-flash'),
	path = require('path'),
	app = express();

const blogRoutes = require('./routes/blogs'),
	commentRoutes = require('./routes/comments'),
	indexRoutes = require('./routes/index');

//CONNECT MONGOOSE TO MONGO DB
// LOCAL DB ---> mongodb://localhost/photon
// MONGO ATLAS DB ---> mongodb+srv://oliverlouis:rIr0ypjtUqape3lI@cluster0.fvxmf.mongodb.net/photon?retryWrites=true&w=majority
mongoose
	.connect('mongodb+srv://oliverlouis:rIr0ypjtUqape3lI@cluster0.fvxmf.mongodb.net/photon?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
	.then(() => console.log('Connected to Database!'.yellow.bold))
	.catch((err) => console.log("Couldn't connect to database", err.message));

app.use(flash());

//PASSPORT CONFIG
app.use(
	require('express-session')({
		secret: 'I love Arielle so much',
		resave: false,
		saveUninitialized: false,
	})
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
// app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSanitizer());
app.use(methodOverride('_method'));

//Requiring Routes
app.use(blogRoutes);
app.use(commentRoutes);
app.use(indexRoutes);

// app.listen(process.env.PORT, process.env.IP, () => {
// 	console.log('Server Connected');
// });
app.listen(3000, () => {
	console.log('Photon Server started'.blue.bold);
});
