const { Router } = require('express');
const notification = require('../controllers/notification.controller');
const router = Router();

router.get('/forgot-password', (req, res) => {
  res.render('forgot-password');
});

router.get('/reset-password', (req, res) => {
  const { token } = req.query;
  if (!token) req.flash('info', 'invalid');
  res.render('forgot-password/reset', { token });
});

router.get('/notifications', notification.page);

module.exports = router;
