const jwt = require("jsonwebtoken");

function tokenVerification(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res
      .status(401)
      .json({ error: "Unauthorized: No auth token provided" });
  }

  jwt.verify(token, process.env.JWT_TOKEN, (err, decoded) => {
    if (err) {
      console.error("Error verifying token:", err);
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
    req.userId = decoded.userId;
    next();
  });
}

module.exports = tokenVerification;
