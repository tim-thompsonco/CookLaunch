import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import isEmpty from 'is-empty';
import * as dateFns from 'date-fns';

// Load input validation
import validateRegisterInput from '../../validation/register.js';
import validateLoginInput from '../../validation/login.js';
import getForgotPasswordEmail from '../../templates/emails.js';

// Load User model
import User from '../../models/User.js';

// Set up Express router
const router = express.Router();

// Use bcrypt to hash passwords and return for later use
const hashPassword = async (password) => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (err) {
    console.log(err);
  }
};

// @route POST api/auth/register
// @desc Register user
// @access Public
router.post('/register', async (req, res) => {
  // Form validation
  const { error, isValid } = await validateRegisterInput(req.body);

  //Check validation
  if (!isValid) {
    return res.status(400).json(error);
  }

  // Check whether user already exists
  const foundUser = await User.findOne({ email: req.body.email });

  // If user exists, return error, otherwise create new user
  if (foundUser) {
    return res.status(400).json('Email already exists');
  } else {
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
    });

    // Hash password before saving in database
    newUser.password = await hashPassword(req.body.password);
    newUser.save();

    try {
      res.status(201).json(newUser);
    } catch (err) {
      res.status(500).json(err);
    }
  }
});

// @route POST api/auth/login
// @desc Login user and return JWT token
// @access Public
router.post('/login', async (req, res) => {
  // Form validation
  const { error, isValid } = await validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(error);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  const foundUser = await User.findOne({ email });

  // Check if user exists
  if (!foundUser) {
    return res.status(400).json('Email not found');
  }

  // Check password
  const isMatch = await bcrypt.compare(password, foundUser.password);

  if (isMatch) {
    // User matched
    // Create JWT Payload
    const payload = {
      id: foundUser._id,
      email: foundUser.email,
      firstName: foundUser.firstName,
      lastName: foundUser.lastName,
      pantry: foundUser.pantry,
    };

    //Sign token
    jwt.sign(
      payload,
      process.env.SECRET_OR_KEY,
      {
        expiresIn: 1209600, // 14 days in seconds
      },
      (err, jwtToken) => {
        res.status(200).json('Bearer ' + jwtToken);
      }
    );
  } else {
    return res.status(400).json('Password incorrect');
  }
});

// @route POST api/auth/forgotpassword
// @desc Reset password by sending E-mail to user
// @access Public
router.post('/forgotpassword', async (req, res) => {
  const email = req.body.email;

  // Create reset password token
  const token = crypto.randomBytes(20).toString('hex');

  // Find user by email
  const foundUser = await User.findOne({ email });

  if (isEmpty(foundUser)) {
    res.status(400).json(null);
  } else {
    // Add reset password token to user account and set to expire in 1 hour
    foundUser.resetPasswordToken = token;
    foundUser.resetPasswordExpires = dateFns.addHours(new Date(), 1);
    foundUser.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = await getForgotPasswordEmail(foundUser.email, token);

    await transporter.sendMail(mailOptions, (err, response) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).send(null);
      }
    });
  }
});

// @route GET api/auth/validateresetpasswordtoken
// @desc Validate token for resetting password that was emailed to user
// @access Private
router.get('/validateresetpasswordtoken', async (req, res) => {
  const foundUser = await User.findOne({
    resetPasswordToken: req.query.resetPasswordToken,
  });

  const currentTime = new Date();

  if (isEmpty(foundUser)) {
    res.status(400).json('User not found.');
  } else if (foundUser.resetPasswordExpires >= currentTime) {
    res.status(200).json(foundUser.email);
  } else {
    res.status(403).json('Password reset token has expired.');
  }
});

// @route PUT api/auth/resetpassword
// @desc Reset user password
// @access Private
router.put('/resetpassword', async (req, res) => {
  // Find user with email passed in from front end
  const foundUser = await User.findOne({ email: req.body.email });

  // Once user is found, hash password, reset token, then save in database
  if (foundUser) {
    try {
      foundUser.password = await hashPassword(req.body.password);
      foundUser.resetPasswordToken = null;
      foundUser.resetPasswordExpires = null;
      foundUser.save();

      res.status(204).json(null);
    } catch (err) {
      res.status(500).json('An error has occurred. ' + err);
    }
  } else {
    res.status(400).json('No user found in database.');
  }
});

export default router;
