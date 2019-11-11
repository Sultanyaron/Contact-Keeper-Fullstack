const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('config');
const auth = require('../middleware/auth');
const { check, validationResult } = require("express-validator");

const User = require("../models/User");

//@route     GET api/auth
//@desc      Get logged in user
//@access    Private
//***the auth (2nd arg, is the middleware that verify the user token) */
router.get('/', auth, async (req, res) => {
  try {
    //This will find the user by the req.user.id passed by the auth and remove the password key (we dont want to send it)
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  };
});

//@route     POST api/auth
//@desc      Auth user & get token
//@access    Public
router.post('/', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], 
async (req,res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //If any error happend during the check send 400 status and send msg within array of the errors
    return res.status(400).json({ errors: errors.array()});
  };

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' })
    };

    //If the user exists, compare entered password to the password of the user found
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    };

    const payload = {
      user: {
        id: user.id
      }
    };

    //If user & password correct
    jwt.sign(payload, config.get('jwtSecret'), {
      expiresIn: 360000
    }, (err, token) => {
      if (err) throw err;
      res.json({token});
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;