const { Router } = require('express');
const jwt = require('jsonwebtoken');
const restrict = require('../middlewares/restrict');
const router = Router();

router.get('/forgot-password', (req, res) => {
  res.render('forgot-password');
});

router.get('/email', restrict, (req, res) => {
  const { id, name } = req.user;
  const token = jwt.sign({ id }, process.env.JWT_SECRET);
  res.render('forgot-password/email', { token, name });
});

router.get('/reset-password', (req, res) => {
  res.render('forgot-password/reset');
});

module.exports = router;
