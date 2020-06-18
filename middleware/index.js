const Blog = require('../models/blog');
const Comment = require('../models/comment');

const middlewareObj = {};

middlewareObj.checkBlogOwnership = (req, res, next) => {
	if (req.isAuthenticated()) {
		Blog.findById(req.params.id, (err, foundBlog) => {
			if (err) {
				res.redirect('/blogs');
			} else {
				if (foundBlog.author.id.equals(req.user._id)) {
					console.log(req.user._id);
					next();
				} else {
					req.flash('error', 'You must be the author of this blog to edit it.');
					res.redirect('back');
				}
			}
		});
	} else {
		req.flash('error', 'You must first log in!');
		res.redirect('back');
	}
};

middlewareObj.checkCommentOwnership = (req, res, next) => {
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, (err, foundComment) => {
			if (err) {
				res.redirect('/blogs');
			} else {
				if (foundComment.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash('error', 'You must be the author of this comment to edit it.');
					res.redirect('back');
				}
			}
		});
	} else {
		req.flash('error', 'You must first log in.');
		res.redirect('back');
	}
};

middlewareObj.isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	req.flash('error', 'You must first log in!');
	res.redirect('/login');
};

module.exports = middlewareObj;
