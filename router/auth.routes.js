const { Router } = require('express');
const auth = require('../controllers/auth.controller');
const restrict = require('../middlewares/restrict');
const router = Router();

router.post('/register', auth.register);
router.post('/login', auth.login);
router.post('/whoami', restrict, auth.whoami);
router.post('/forgot-password', auth.sendResetPasswordLink);
router.post('/reset-password', (req, res, next) => {
  try {
    const { token } = req.query;
    if (!token) {
      res.status(400).json({
        status: false,
        message: 'Token must be provided',
        data: null
      });
    }

    req.flash('info', 'success');
    res.redirect(`/reset-password?token=${token}`);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
