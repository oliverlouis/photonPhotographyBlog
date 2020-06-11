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
router.get('/login', (req, res) => {
	res.render('login');
});

//handle login logic
router.post('/login', passport.authenticate('local', {successRedirect: '/blogs', failureRedirect: '/login'}), (req, res) => {});

//handle logout logic
router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('back');
});

module.exports = router;
