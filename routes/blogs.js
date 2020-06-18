const express = require('express');
const router = express.Router({mergeParams: true});
const Blog = require('../models/blog');
const middleware = require('../middleware');

//RESTFUL ROUTES
//INDEX
router.get('/', (req, res) => {
	res.render('landing');
});

router.get('/blogs', (req, res) => {
	Blog.find({}, (err, blogs) => {
		if (err) {
			console.log(err);
		} else {
			res.render('blogs/index', {blog: blogs, currentUser: req.user});
		}
	});
});
//===================================================================
//CREATE BLOG ROUTES
//===================================================================

//NEW ROUTE
router.get('/blogs/new', middleware.isLoggedIn, (req, res) => {
	res.render('blogs/new');
});

//CREATE ROUTE
// router.post('/blogs', middleware.isLoggedIn, (req, res) => {
// 	Blog.create(req.body.blog, (err, newBlog) => {
// 		if (err) {
// 			res.redirect('new');
// 		} else {
// 			res.redirect('/blogs');
// 		}
// 	});
// });

router.post('/blogs', middleware.isLoggedIn, (req, res) => {
	//get data from form and add to campgrounds array
	const name = req.body.name;
	const image = req.body.image;
	const description = req.body.description;
	let author = {
		id: req.user._id,
		username: req.user.username,
	};
	let newBlog = {name: name, image: image, description: description, author: author};
	//Create new blog and add it to database
	Blog.create(newBlog, (err, blog) => {
		if (err) {
			console.log(err);
		} else {
			//redirect back to campgrounds page
			res.redirect('/blogs');
		}
	});
});

//SHOW ROUTE
router.get('/blogs/:id', (req, res) => {
	Blog.findById(req.params.id)
		.populate('comments')
		.exec((err, foundBlog) => {
			if (err) {
				console.log(err);
			} else {
				//Render Show template with that blog
				res.render('blogs/show', {blog: foundBlog});
			}
		});
});

//EDIT ROUTE
router.get('/blogs/:id/edit', middleware.checkBlogOwnership, (req, res) => {
	Blog.findById(req.params.id, (err, foundBlog) => {
		if (err) {
			res.redirect(`blogs/${req.params.id}`);
		} else {
			res.render('blogs/edit', {blog: foundBlog});
		}
	});
});

//UPDATE ROUTE
router.put('/blogs/:id', middleware.checkBlogOwnership, (req, res) => {
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
		if (err) {
			res.redirect('/blogs');
		} else {
			res.redirect(`/blogs/${req.params.id}`);
		}
	});
});

//DELETE ROUTE
router.delete('/blogs/:id', middleware.checkBlogOwnership, (req, res) => {
	Blog.findByIdAndRemove(req.params.id, (err) => {
		if (err) {
			res.redirect('/blogs');
		} else {
			res.redirect('/blogs');
		}
	});
});

module.exports = router;
