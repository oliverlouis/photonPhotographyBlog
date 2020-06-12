const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

//===================================================================
//AUTHENTICATION AND SIGN UP ROUTES
//===================================================================

//SIGN UP
//show sign up form
router.get('/register', (req, res) => {
	res.render('register');
});

//handle sign up logic
router.post('/register', (req, res) => {
	User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
		if (err) {
			console.log(err);
			req.flash('error', err.message);
			return res.render('register');
		} else {
			passport.authenticate('local')(req, res, () => {
				req.flash('success', 'Welcome to Photon, ' + user.username);
				res.redirect('/blogs');
			});
		}
	});
});

//LOG IN
//show log in form
router.get('/login', (req, res) => {
	res.render('login');
});

//handle login logic
router.post('/login', passport.authenticate('local', {successRedirect: '/blogs', failureRedirect: '/login', failureFlash: true, successFlash: true}), (req, res) => {});

//handle logout logic
router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success', 'Logged out!');
	res.redirect('back');
});

module.exports = router;
