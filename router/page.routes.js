const { Router } = require('express');
const router = Router();

router.get('/forgot-password', (req, res) => {
  res.render('forgot-password');
});

module.exports = router;
