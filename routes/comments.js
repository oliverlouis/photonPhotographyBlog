const express = require('express');
const router = express.Router({mergeParams: true});
const Blog = require('../models/blog');
const Comment = require('../models/comment');
const middleware = require('../middleware');

//=============================
//COMMENT ROUTES
//=============================

//NEW ROUTE - SHOW FORM
router.get('/blogs/:id/comments/new', middleware.isLoggedIn, (req, res) => {
	Blog.findById(req.params.id, (err, blog) => {
		if (err) {
			console.log(err);
		} else {
			req.flash('error', 'You must first log in!');
			res.render('comments/new', {blog: blog});
		}
	});
});

//NEW ROUTE POST
router.post('/blogs/:id/comments', middleware.isLoggedIn, (req, res) => {
	//find the respective campground in th DB
	Blog.findById(req.params.id, (err, blog) => {
		if (err) {
			console.log(err);
			req.flash('error', 'You must first log in!');
			res.redirect('/blogs');
		} else {
			//create new comment
			Comment.create(req.body.comment, (err, comment) => {
				if (err) {
					console.log(err);
				} else {
					//add username and id to comment and save
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					//connect new comment to campground
					blog.comments.push(comment);
					blog.save();
					req.flash('success', 'Comment added!');
					res.redirect('/blogs/' + blog._id);
				}
			});
		}
	});
});

//UPDATE COMMENTS ROUTES

//SHOW EDIT FORM
router.get('/blogs/:id/comments/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
	Comment.findById(req.params.comment_id, (err, foundComment) => {
		if (err) {
			res.redirect('back');
		} else {
			res.render('comments/edit', {blog_id: req.params.id, comment: foundComment});
		}
	});
});

//HANDLE UPDATE
router.put('/blogs/:id/comments/:comment_id', middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
		if (err) {
			res.redirect('back');
		} else {
			req.flash('success', 'Comment edited!');
			res.redirect('/blogs/' + req.params.id);
		}
	});
});

//DELETE COMMENT ROUTE
router.delete('/blogs/:id/comments/:comment_id', middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndRemove(req.params.comment_id, (err) => {
		if (err) {
			req.flash('error', 'You must first log in!');
			res.redirect('back');
		} else {
			req.flash('success', 'Comment deleted!');
			res.redirect('/blogs/' + req.params.id);
		}
	});
});

module.exports = router;
