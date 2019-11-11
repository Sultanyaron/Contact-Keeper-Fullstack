//The middleware protects Routes that are private and vaid their jwt
const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
  //Get token from the header, the key (x-auth-token) can be any name we want
  const token = req.header('x-auth-token')

  //Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied'});
  };

  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    req.user = decoded.user; 
    
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  };
};
