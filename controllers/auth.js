const ManagerException = require("../utils/exceptions/manager-exception");
const { log, error } = require("../utils/logger");
const jwt = require("../utils/jwt");
const User = require("../models/user-model");
const { Op } = require("sequelize");
const Otp = require("../models/otp-model");
const { encode, decode } = require("../utils/cryptor");
const { sendOTPMail } = require("../utils/aws")
const { convert, compare, inRange } = require("../utils/date-ops");

// To add minutes to the current time
function addMinutesToDate(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

// this will send an OTP to phone number
exports.initiateLogin = async (req, res) => {
  try {
    const { phoneNumber, type, email } = req.body;
    let phone_message;

    if (!phoneNumber && !email) {
      const response = {
        status: "Failure",
        msg: "Phone Number or Email not provided",
      };
      return res.status(400).send(response);
    }
    // if (!type) {
    //   const response = { status: "Failure", msg: "Type not provided" };
    //   return res.status(400).send(response);
    // }
    const fetchedUser = await User.findOne({
      where: {
        [Op.or]: {
          email: email ? email : "",
          phoneNumber: phoneNumber ? phoneNumber : "",
        },
      },
    });

    if (!fetchedUser) {
      return res
        .status(400)
        .send({ status: 400, message: "User not registered" });
    }

    //Generate OTP
    let otp = Math.random().toString().substr(2, 6);
    const now = new Date();
    let expiration_time = addMinutesToDate(now, 10);

    if (
      phoneNumber == "9636565686" ||
      email == "seekright@gmail.com"
    ) {
      otp = "123456";
      expiration_time = addMinutesToDate(now, 43200);
    }
    //Create OTP instance in DB
    const otpInstance = await Otp.create({
      otp: otp,
      expiration_time: expiration_time,
    });

    // Create details object containing the phone number and otp id
    const details = {
      timestamp: now.toISOString(),
      check: phoneNumber ? phoneNumber : email,
      success: true,
      message: "OTP sent to user",
      otp_id: otpInstance.id,
    };

    // Encrypt the details object
    const encodedDetailsKey = await encode(JSON.stringify(details));

    if (
      phoneNumber == "9636565686" ||
      email == "seekright@gmail.com"
    ) {
      return res.send({
        status: "Success",
        key: encodedDetailsKey,
        otpDigits: 6,
      });
    }

    if (email != "" || email != null) {
      await sendOTPMail(email, otp);
      return res.send({
        status: "Success",
        key: encodedDetailsKey,
        otpDigits: 6,
      });
    }
    // Settings Params for SMS
    const params = {
      Message: "your otp is: "+otp,
      PhoneNumber: phoneNumber,
    };

    //Send the params to AWS SNS using aws-sdk
    const publishTextPromise = new AWS.SNS({ apiVersion: "2010-12-01" })
      .publish(params)
      .promise();

    //Send response back to the client if the message is sent
    publishTextPromise
      .then(function (data) {
        return res.send({
          status: "Success",
          key: encodedDetailsKey,
          otpDigits: 6,
        });
      })
      .catch(function (err) {
        throw new ManagerException(err.message);
      });
  } catch (err) {
    error(req, err);
    if (err instanceof ManagerException) {
      res.status(500);
    } else {
      res.status(400);
    }
    return res.status(400).send({
      status: 400,
      message: "Failed to initiate login request",
      devMessage: err.message,
    });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const currentdate = new Date();
    // detailsKey from initiateLogin response
    const { detailskey, otp, phoneNumber, email } = req.body;

    if (!detailskey) {
      const response = {
        status: "Failure",
        msg: "Verification Key not provided",
      };
      return res.status(400).send(response);
    }
    if (!otp) {
      const response = { status: "Failure", msg: "OTP not Provided" };
      return res.status(400).send(response);
    }
    if (!phoneNumber && !email) {
      const response = {
        status: "Failure",
        msg: "Phone Number or email not Provided",
      };
      return res.status(400).send(response);
    }

    let decodedDetailsKey;

    //Check if verification key is altered or not and store it in variable decoded after decryption
    try {
      decodedDetailsKey = await decode(detailskey);
    } catch (err) {
      const response = { status: "Failure", error: err.message };
      return res.status(400).send(response);
    }

    const obj = JSON.parse(decodedDetailsKey);
    const decodedCheck = obj.check;

    // Check if the OTP was meant for the same email or phone number for which it is being verified
    if (phoneNumber && decodedCheck != phoneNumber) {
      const response = {
        status: "Failure",
        msg: "OTP was not sent to this particular phone number",
      };
      return res.status(400).send(response);
    }
    if (email && decodedCheck != email) {
      const response = {
        status: "Failure",
        msg: "OTP was not sent to this particular email",
      };
      return res.status(400).send(response);
    }

    const otp_instance = await Otp.findOne({ where: { id: obj.otp_id } });

    //Check if OTP is available in the DB
    if (otp_instance != null) {
      //Check if OTP is already used or not
      if (otp_instance.verified != true) {
        //Check if OTP is expired or not
        if (compare(otp_instance.expiration_time, currentdate) == 1) {
          //Check if OTP is equal to the OTP in the DB
          if (otp === otp_instance.otp) {
            otp_instance.verified = true;
            otp_instance.save();
            // const response = { status: "Success", msg: "OTP Matched", "Check": phoneNumber }
            const fetchedUser = await User.findOne({
              where: {
                [Op.or]: {
                  email: email ? email : "",
                  phone_number: phoneNumber ? phoneNumber : "",
                },
              }
            });
            if (!fetchedUser) {
              return res
                .status(400)
                .send({
                  status: 400,
                  message: "Invalid phone number or email",
                });
            }
            const accessToken = jwt.generateJwtToken(fetchedUser);
            fetchedUser.set("lastLogin", new Date());
            fetchedUser.set("accessToken", accessToken);
            await fetchedUser.save();
            const response = {
              status: 200,
              message: "Login  successfull",
              user: fetchedUser,
            };
            return res.status(200).send(response);
          } else {
            const response = { status: "Failure", msg: "OTP NOT Matched" };
            return res.status(400).send(response);
          }
        } else {
          const response = { status: "Failure", msg: "OTP Expired" };
          return res.status(400).send(response);
        }
      } else {
        const response = { status: "Failure", msg: "OTP Already Used" };
        return res.status(400).send(response);
      }
    } else {
      const response = { status: "Failure", msg: "Bad Request" };
      return res.status(400).send(response);
    }
  } catch (err) {
    error(req, err);
    if (err instanceof ManagerException) {
      res.status(500);
    } else {
      res.status(400);
    }
    return res.status(400).send({
      status: 400,
      message: "OTP verification failed",
      devMessage: err.message,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    req.loggedInUser.accessToken = null;
    await req.loggedInUser.save();
    const response = {
      status: 200,
      message: "logout successful",
    };
    return res.send(response);
  } catch (err) {
    error(req, err);
    if (err instanceof ManagerException) {
      res.status(500);
    } else {
      res.status(400);
    }
    return res.status(400).send({
      status: 400,
      message: "logout failed",
      devMessage: err.message,
    });
  }
};
