const router = require('express').Router();
const C = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

router.post('/register', C.register);
router.post('/login', C.login);
router.get('/me', authenticate, C.me);

module.exports = router;
