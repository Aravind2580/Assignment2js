const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// Register
router.get('/register', (req, res) => res.render('register'));

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  await User.create({ username, password: hash });
  req.flash('success_msg', 'Registration successful');
  res.redirect('/auth/login');
});

// Login
router.get('/login', (req, res) => res.render('login'));

router.post('/login', passport.authenticate('local', {
  successRedirect: '/tasks',
  failureRedirect: '/auth/login',
  failureFlash: true
}));

// GitHub Login
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => res.redirect('/tasks')
);

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    req.flash('success_msg', 'Logged out');
    res.redirect('/');
  });
});

module.exports = router;
