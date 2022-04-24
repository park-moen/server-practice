const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.followingCount = 0;
  res.locals.followerCount = 0;
  res.locals.followerListId = [];

  next();
});

router.get('/profile', isLoggedIn, (req, res, next) => {
  res.render('profile', { title: '내 정보 - NodeBird' });
});

router.get('/join', isNotLoggedIn, (req, res, next) => {
  res.render('join', { title: '회원가입 - NodeBird' });
});

router.get('/', (req, res, next) => {
  const twits = [];

  res.render('main', {
    title: 'main',
    twits,
  });
});

module.exports = router;
