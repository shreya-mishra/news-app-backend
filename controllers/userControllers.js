import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import otpGenerator from "otp-generator";
import generateToken from "../utils/generateToken.js";

//@description     Auth the user
//@route           POST /api/user/login
//@access          Public
const authUser = asyncHandler(async (req, res) => {
  const { phone } = req.body;

  const otp = otpGenerator.generate(4, {
    upperCase: false,
    specialChars: false,
  });

  console.log(otp);

  if (!phone || phone.toString().length !== 10) {
    res.status(400);
    throw new Error("Please Provide correct Phone number");
  }

  const user = await User.findOne({ phone: phone });

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.pic = req.body.pic || user.pic;
    user.phone = req.body.phone || user.phone;
    user.isAdmin = user.isAdmin;
    user.otp = otp;

    await user.save();
    res.status(201).json({ success: true, otp: otp });
  } else {
    const createdUser = await User.create({
      phone,
      otp,
    });
    await createdUser.save();
    res.status(201).json({ success: true, otp: otp });
  }
});

//@description     Verify the OTP
//@route           POST /api/user/verify
//@access          Public
const verifyOTP = asyncHandler(async (req, res) => {
  const { otp, phone } = req.body;

  console.log(otp, phone);

  const user = await User.findOne({ phone: phone });

  // Calculating the differnce in OTP generation time
  const now = new Date();
  const old = new Date(user.updatedAt);
  let diff = (old.getTime() - now.getTime()) / 1000;
  diff /= 60;
  const final = Math.abs(Math.round(diff));

  if (final > 30) {
    res.json({
      message: "OTP Expired",
    });
  } else {
    // Checking OTP Match
    if (otp == user.otp) {
      res.status(201).json({
        user,
        token: generateToken(user._id),
        success: true,
      });
    } else {
      res.status(401).json({
        success: false,
      });
    }
  }
});

export { authUser, verifyOTP };
