const router = require('express').Router();

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const verifyJWT = require('../Utils/VerifyJWT');

//register

router.post('/register', async (req, res) => {
  try {
    const userData = req.body;
    const takenUsername = await User.findOne({ username: userData.username });
    const takenEmail = await User.findOne({ email: userData.email });

    if (takenUsername || takenEmail)
      res.json({ message: 'Username or email has been already taken' });
    else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      });

      const user = await newUser.save();
      res.status(200).json(user);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//login

// router.post("/login", async (req, res) => {
//   try {
//     const user = await User.findOne({ username: req.body.username });
//     !user && res.status(400).json("Wrong Credentials");

//     const validatePassword = await bcrypt.compare(
//       req.body.password,
//       user.password
//     );
//     !validatePassword && res.status(400).json("Wrong Credentials");

//       const {password, ...data} = user._doc;

//     res.status(200).json(data);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });
router.post('/login', (req, res) => {
  const userLoggedIn = req.body;
  User.findOne({ username: userLoggedIn.username }).then((dbUser) => {
    if (!dbUser) {
      return res.json({ message: 'The Username or password is inavlid' });
    }
    bcrypt.compare(userLoggedIn.password, dbUser.password).then((isCorrect) => {
      if (isCorrect) {
        const payload = {
          id: dbUser._id,
          username: dbUser.username,
        };
        jwt.sign(
          payload,
          process.env.JWT_SECRET,
          { expiresIn: 86400 },
          (err, token) => {
            if (err) return res.json({ message: err });
            return res.json({
              message: 'Success',
              token: 'Bearer ' + token,
            });
          }
        );
      } else {
        return res.json({ message: 'Invalid username or password' });
      }
    });
  });
});

router.get('/getUsername', verifyJWT, (req, res) => {
  res.json({ isLoggedIn: true, username: req.body.username });
});
module.exports = router;
