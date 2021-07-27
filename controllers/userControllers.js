import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import otpGenerator from "otp-generator";
import generateToken from "../utils/generateToken.js";
import Bookmark from "../models/bookmarkModel.js";
import fast2sms from "fast-two-sms"


//@description     Get user info
//@route           GET /api/user/
//@access          Public
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.body._id);

  if (user) {
    res.status(201).json({
      name: user.name,
      email: user.email,
      pic: user.pic,
      wallet: user.wallet,
      isAdmin: user.isAdmin,
      location: user.location,
      phone: user.phone,
    });
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
});

//@description     Login the user
//@route           POST /api/user/login
//@access          Public
const authUser = asyncHandler(async (req, res) => {
  const { phone } = req.body;
  
  const otp = otpGenerator.generate(4, {
    upperCase: false,
    specialChars: false,
  });
  
  
  if (!phone || phone.toString().length !== 10) {
    res.status(400);
    throw new Error("Please Provide correct Phone number");
  }
  fast2sms.sendMessage({authorization : process.env.API_KEY , message : `Your Otp IS ${otp}`,  numbers : [phone]}).then(res=>{
    console.log("options",res)

  }).catch((err)=>console.log("err in msg sending",err))
  
  const user = await User.findOne({ phone: phone });

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.pic = req.body.pic || user.pic;
    user.phone = req.body.phone || user.phone;
    user.location = req.body.location || user.location;
    user.isAdmin = user.isAdmin;
    user.otp = otp;

    await user.save();
    res.status(201).json({ success: true, otp: user.otp });
  } else {
    const createdUser = await User.create({
      phone,
      otp,
    });
    await createdUser.save();
    res.status(201).json({ success: true, otp: user.otp });
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

// @desc    update profile
// @route   PUT /api/user/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  // profile pic logic
  // if (!req.file)
  //   return res.status(400).json({ message: "No image in the request" });
  // const fileName = req.file.filename;
  // const basePath = `${req.protocol}://${req.get(
  //   "host"
  // )}/public/uploads/${fileName}`;

  // update logic
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.pic = req.body.pic || user.pic;
    user.phone = req.body.phone || user.phone;
    user.location = req.body.location || user.location;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(201).json({
      updatedUser,
      token: generateToken(user._id),
      success: true,
    });
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
});

// @desc    GET all bookmarks
// @route   GET /api/user/bookmark
// @access  Private
const getBookmarkNews = asyncHandler(async (req, res) => {
  const bookmark = await Bookmark.findOne({ user: req.user._id }).populate(
    "newsList"
  );

  res.send(bookmark);
});

// @desc    ADD a bookmark
// @route   PUT /api/user/bookmark
// @access  Private
const addBookmarkNews = asyncHandler(async (req, res) => {
  const { newsId } = req.body;

  const booked = await Bookmark.findOne({ user: req.user._id });

  if (booked) {
    const bookmarked = await Bookmark.findByIdAndUpdate(
      booked._id,
      {
        $push: { newsList: newsId },
      },
      {
        new: true,
      }
    );

    res.json(bookmarked);
  } else {
    const bookmarked = await Bookmark.create({
      user: req.user._id,
      newsList: [newsId],
    });

    await bookmarked.save();
    res.status(201).json({ success: true, message: "News Bookmarked" });
  }
});

// @desc    Remove a bookmark
// @route   PUT /api/user/removebookmark
// @access  Private
const removeBookmarkNews = asyncHandler(async (req, res) => {
  const { newsId } = req.body;

  const booked = await Bookmark.findOne({ user: req.user._id });

  if (booked) {
    const bookmarked = await Bookmark.findByIdAndUpdate(
      booked._id,
      {
        $pull: { newsList: newsId },
      },
      {
        new: true,
      }
    );

    res.json(bookmarked);
  } else {
    const bookmarked = await Bookmark.create({
      user: req.user._id,
      newsList: [newsId],
    });

    await bookmarked.save();
    res.status(201).json({ success: true, message: "News Bookmark Removed" });
  }
});

export {
  getProfile,
  authUser,
  verifyOTP,
  updateProfile,
  getBookmarkNews,
  addBookmarkNews,
  removeBookmarkNews,
};
