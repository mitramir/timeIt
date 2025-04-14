const secretKey = process.env.REVENUECAT_WEBHOOK_TOKEN;

module.exports = function (req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (!bearerHeader) return res.sendStatus(401);
  const token = bearerHeader.split(" ")[1];

  if (!token || token !== secretKey) {
    return res.sendStatus(401); //Unauthorized
  }

  next();
};
