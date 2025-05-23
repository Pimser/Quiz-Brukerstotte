const bcrypt = require('argon2');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');


//token funkjson
const maxAge = 3 * 24 * 60 * 60; //3 dagers levetid
const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: maxAge
    });
}


// Login controller

module.exports.login_get = (req, res) => {
  res.render('login', { title: 'Login' });
}

module.exports.login_post = async (req, res) => {
  const { username, password } = req.body;

  console.log('Login attempt with email:',req.body);
  console.log('Login attempt with email:', username);

  try {
    const user = await User.findOne({ username });
    if (!user) {
      console.log('User not found for email:', username);
      return res.render("login", { title: "Login", error: "Unvalid username or password!"})
    }

    console.log('Stored hashed password for email:', user.password);

    const isMatch = await bcrypt.verify(user.password, password);
    console.log('Password verification result for email:', username, isMatch);

    if (!isMatch) {
      console.log('Password mismatch for email:', username);
      return res.render("login", {title: "Login", error: "Unvalid username or password!"})
    }

    const token = createToken(user._id);
    console.log('JWT generated for user ID:', user._id);

    res.cookie('token', token, { httpOnly: true , maxAge: maxAge * 1000});
    res.redirect('/');
  } catch (err) {
    console.error('Error during login:', err);
    res.render('login', { title: 'Login', error: 'Serverfeil. Prøv igjen.' });
  }
};

// Register controller

module.exports.register_get = (req, res) => {
  res.render('register', { title: 'Register' });
}

module.exports.register_post = [
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("register", {
        title: "Register",
        error: errors.array().map(e => e.msg).join("<br>")
      })
    }

    const { username, email, password } = req.body;

    try {
      if (!process.env.JWT_SECRET) {
        return res.render("register", {title: "Register", error: "Server configuration error!" })
      }

      const hashedPassword = await bcrypt.hash(password);
      const user = new User({ username, email, password: hashedPassword, role: 'user' });
      await user.save();

      const token = createToken(user._id);
      res.cookie('token', token, { httpOnly: true , maxAge: maxAge * 1000 }); // Assign JWT as a cookie
      res.redirect('/');
    } catch (err) {
      console.error('Error during registration for email:', email, err);
      res.render("register", { title: "Register", error: errorMsg});
    }
  }
];

// Logout controller
module.exports.logout_get = (req, res) => {
  console.log("Logout route hit");

    res.cookie("token", "", { httpOnly: true, maxAge: 1, path: "/" });
    console.log("Cookie cleared");

    res.redirect("/");
    console.log("Redirecting to /");
}