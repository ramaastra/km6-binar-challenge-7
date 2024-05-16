const { Router } = require('express');
const auth = require('../controllers/auth.controller');
const restrict = require('../middlewares/restrict');
const router = Router();

router.post('/register', auth.register);
router.post('/login', auth.login);
router.post('/whoami', restrict, auth.whoami);
router.post('/forgot-password', auth.sendResetPasswordLink);
router.post('/reset-password', auth.resetPassword);

module.exports = router;
