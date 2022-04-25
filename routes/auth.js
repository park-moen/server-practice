const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.post('/join', isNotLoggedIn, async (req, res, next) => {
  const { email, nick, password } = req.body;

  try {
    const exUser = await User.findOne({ where: { email } });

    if (exUser) {
      return res.redirect('/join?=exist');
    }

    const hash = await bcrypt.hash(password, 12);

    await User.create({
      email,
      nick,
      password: hash,
    });
    res.redirect('/');
  } catch (error) {
    console.error(erro);
    next(error);
  }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }

    if (!user) {
      return res.redirect(`/?loginError=${info.message}`);
    }

    req.login(user, loginError => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }

      res.redirect('/');
    });
  })(req, res, next);
});

router.get('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

router.get('/kakao', isNotLoggedIn, passport.authenticate('kakao'));

router.get(
  '/kakao/callback',
  passport.authenticate('kakao', {
    failureRedirect: '/',
  }),
  (req, res) => {
    res.redirect('/');
  }
);

module.exports = router;
