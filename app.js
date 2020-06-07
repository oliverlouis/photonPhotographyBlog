const express = require('express');
(bodyParser = require('body-parser')),
	(mongoose = require('mongoose')),
	(colors = require('colors')),
	(Comment = require('./models/comment')),
	(Blog = require('./models/blog')),
	(User = require('./models/user')),
	(methodOverride = require('method-override')),
	(passport = require('passport')),
	(LocalStrategy = require('passport-local')),
	(expressSanitizer = require('express-sanitizer')),
	(app = express());

//CONNECT MONGOOSE TO MONGO DB
mongoose
	.connect('mongodb://localhost/photon', {useNewUrlParser: true, useUnifiedTopology: true})
	.then(() => console.log('Connected to Database!'.yellow.bold))
	.catch((err) => console.log("Couldn't connect to database", err));

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
	next();
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(expressSanitizer());
app.use(methodOverride('_method'));

//MONGOOSE/MODEL CONFIG

//RESTFUL ROUTES
//INDEX
app.get('/', (req, res) => {
	res.redirect('/blogs');
});

app.get('/blogs', (req, res) => {
	Blog.find({}, (err, blogs) => {
		if (err) {
			console.log(err);
		} else {
			res.render('index', {blog: blogs, currentUser: req.user});
		}
	});
});
//===================================================================
//CREATE BLOG ROUTES
//===================================================================

//NEW ROUTE
app.get('/blogs/new', (req, res) => {
	res.render('new');
});

//CREATE ROUTE
app.post('/blogs', (req, res) => {
	Blog.create(req.body.blog, (err, newBlog) => {
		if (err) {
			res.redirect('new');
		} else {
			res.redirect('/blogs');
		}
	});
});

//SHOW ROUTE
app.get('/blogs/:id', (req, res) => {
	Blog.findById(req.params.id, (err, foundBlog) => {
		if (err) {
			res.render('/blogs');
		} else {
			res.render('show', {blog: foundBlog});
		}
	});
});

//EDIT ROUTE
app.get('/blogs/:id/edit', (req, res) => {
	Blog.findById(req.params.id, (err, foundBlog) => {
		if (err) {
			res.redirect(`blogs/${req.params.id}`);
		} else {
			res.render('edit', {blog: foundBlog});
		}
	});
});

//UPDATE ROUTE
app.put('/blogs/:id', (req, res) => {
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
		if (err) {
			res.redirect('/blogs');
		} else {
			res.redirect(`/blogs/${req.params.id}`);
		}
	});
});

//DELETE ROUTE
app.delete('/blogs/:id', (req, res) => {
	Blog.findByIdAndRemove(req.params.id, (err) => {
		if (err) {
			res.redirect('/blogs');
		} else {
			res.redirect('/blogs');
		}
	});
});

//===================================================================
//AUTHENTICATION AND SIGN UP ROUTES
//===================================================================

//SIGN UP
//show sign up form
app.get('/register', (req, res) => {
	res.render('register');
});

//handle sign up logic
app.post('/register', (req, res) => {
	User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
		if (err) {
			console.log(err);
			return res.render('register');
		} else {
			passport.authenticate('local')(req, res, () => {
				res.redirect('/blogs');
			});
		}
	});
});

//LOG IN
//show log in form
app.get('/login', (req, res) => {
	res.render('login');
});

//handle login logic
app.post('/login', passport.authenticate('local', {successRedirect: '/blogs', failureRedirect: '/login'}), (req, res) => {});

//handle logout logic
app.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/blogs');
});

app.listen(3000, () => {
	console.log('Photon Server started'.blue.bold);
});
