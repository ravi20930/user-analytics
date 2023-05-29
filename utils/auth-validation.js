import Token from "../models/token-model.js";
import User from "../models/user-model.js";
import { getLocation } from "./location.js";

export const validateAuthorization = () => {
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
    Token.findOne({
      where: { token: authToken },
      include: User
    })
      .then(async (tokenDetails) => {
        // console.log(tokenDetails.token)
        if (!tokenDetails) {
          return res.status(401).send({ status: 401, message: "Invalid Authorization." });
        }
        req.loggedInUser = tokenDetails.user;
        req.loggedInUser.tokenId = tokenDetails.id;
        const currentTime = Date.now();
        if (tokenDetails.apiCallCount != 0) {
          tokenDetails.totalUsageDuration += currentTime - tokenDetails.lastUsed; // Update usage duration
        }
        tokenDetails.lastUsed = currentTime; // Update the usage timestamp
        await Token.increment('apiCallCount', { where: { id: tokenDetails.id } });
        await tokenDetails.save();
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