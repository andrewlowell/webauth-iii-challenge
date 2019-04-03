const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const secret = require('./secrets.js').jwtSecret; // <<<<<<<<<<<<
const Users = require('../users/users-model.js');

const restricted = require('../auth/restricted-middleware.js');

// for endpoints beginning with /api/auth
router.post('/register', (req, res) => {
  let user = req.body;
  console.log('user', user)
  const hash = bcrypt.hashSync(user.password, 10); // 2 ^ n
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post('/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);

        res.status(200).json({
          message: `Welcome ${user.username}!`,
          token,
        });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.get('/users', restricted, (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

function withRole(role) {
  return function(req, res, next) {
    if (
      req.decodedJwt &&
      req.decodedJwt.roles &&
      req.decodedJwt.roles.includes(role)
    ) {
      next();
    } else {
      res.status(403).json({ message: 'you have no power here' });
    }
  };
}

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
    roles: ['student', 'ta'], // pretend they come from database user.roles
  };
  // removed the const secret from this line <<<<<<<<<<<<<<<<<<<<<<<
  const options = {
    expiresIn: '1d',
  };

  return jwt.sign(payload, secret, options); // returns valid token
}

module.exports = router;