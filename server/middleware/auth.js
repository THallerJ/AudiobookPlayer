const isAuthenticated = (req, res, next) => {
  if (req.user && req.user.length) {
    req.authUser = req.user[0];
    return next();
  }

  res.status(403).send();
  return next();
};

module.exports = { isAuthenticated };
