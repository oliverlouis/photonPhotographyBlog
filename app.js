const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const colors = require('colors');
const methodOverride = require('method-override');
const expressSanitizer = require('express-sanitizer');
const app = express();

//CONNECT MONGOOSE TO MONGO DB
mongoose
	.connect('mongodb://localhost/photon', {useNewUrlParser: true, useUnifiedTopology: true})
	.then(() => console.log('Connected to Database!'.yellow.bold))
	.catch((err) => console.log("Couldn't connect to database", err));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(expressSanitizer());
app.use(methodOverride('_method'));

//MONGOOSE/MODEL CONFIG
const blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now},
});

const Blog = mongoose.model('Blog', blogSchema);

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
			res.render('index', {blog: blogs});
		}
	});
});

app.listen(3000, () => {
	console.log('Photon Jar Server started'.blue.bold);
});

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
