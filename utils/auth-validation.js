const User = require("../models/user-model");

exports.validateAuthorization = () => {
  return (req, res, next) => {
    const headers = req.headers;
    if (!headers.authorization) {
      res
        .status(403)
        .send({ status: 403, message: "Autharization not provided." });
      return;
    }
    let authToken = headers.authorization;
    if (String(authToken).includes("Bearer ")) {
      authToken = headers.authorization.split("Bearer ")[1];
    }
    User.findOne({ where: { accessToken: authToken }, /*include: UserRoles*/ })
      .then((fetchedUser) => {
        if (!fetchedUser) {
          return res.status(401).send({ status: 401, message: "Invalid Authorization." });
        }
        req.loggedInUser = fetchedUser;
        next();
      })
      .catch((error) => {
        console.error(error);
        res
          .status(401)
          .send({ status: 401, message: "Invalid Authorization." });
        return;
      });
  };
};