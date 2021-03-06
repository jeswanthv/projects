const jwt = require("jsonwebtoken")


const verifyJWT = (req, res, next) => {
  const token = req.header['x-access-token']?.split(' ')[1];
  if (token) {
    jwt.verify(token, process.env.PASSPORTSECRET, (err, decoded) => {
      if (err)
        return res.json({
          isLoggedIn: false,
          message: 'failed to Authenticate',
        });
      req.user = {};
      (req.user.id = decoded.id), (req.user.username = decoded.username);
      next();
    });
  } else {
    res.json({ message: 'Incorrect Token is Given', isLoggedIn: false });
  }
};


module.exports = verifyJWT