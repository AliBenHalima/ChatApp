const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token,"my-secret-token");
    const userId = decodedToken.userId;
    // if(!token) res.status(401).send("Access denied");
    next();

  }  catch(err){
    res.send("Invalid Token");
}
};