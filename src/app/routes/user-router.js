const router = require('express').Router();
const controller = require('../controllers/user-controller');
const policy = require('../middlewares/user-policy');

router.post('', policy.register, controller.register);
router.post('/auth', policy.login, controller.localAuth);
router.post('/auth/google', policy.googleAuth, controller.googleAuth);
router.get('/load-session', policy.authenticate, controller.loadSession);
router.get('/validate/email', controller.validateEmail);

module.exports = router;
