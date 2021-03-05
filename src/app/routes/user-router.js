const router = require('express').Router();
const controller = require('../controllers/user-controller');
const policy = require('../middlewares/user-policy');

router.post('/', policy.register, controller.register);
router.post('/auth', policy.login, controller.localAuth);
router.get('/load-session', policy.authenticate, controller.loadSession);

module.exports = router;
