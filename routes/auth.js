const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');

const router = express.Router();

router.post('/join', isNotLoggedIn, async (req, res, next) => {
  const { email, nick, password } = req.body;

  try {
    const exUser = await User.findOne({ where: { email } });

    if (exUser) {
      return res.redirect('/join?error=exist');
    }

    const hash = await bcrypt.hash(password, 12);

    await User.create({
      email,
      nick,
      password: hash,
    });
    res.redirect('/');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
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

router.get('/kakao', isNotLoggedIn, passport.authenticate('kakao'));

router.get(
  '/kakao/callback',
  passport.authenticate('kakao', {
    failureRedirect: '',
  }),
  (req, res) => {
    res.redirect('/');
  }
);

router.get('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
