import asyncHandler from "express-async-handler";
import News from "../models/newsModel.js";
import TempNews from "../models/tempNewsModel.js";

// @desc    Get to be approved news
// @route   GET /api/news/admin
// @access  Private
const getApproveNews = asyncHandler(async (req, res) => {
  const news = await TempNews.find();
  res.json(news);
});

//@description     Create single News
//@route           POST /api/news/create
//@access          Private
const createTempNews = asyncHandler(async (req, res) => {
  const { title, content, category, source, location, pic } = req.body;

  if (!title || !content || !category || !source || !location) {
    res.status(400);
    throw new Error("Please Fill all the feilds");
  } else {
    const news = new TempNews({
      user: req.user._id,
      title,
      content,
      category,
      source,
      location,
      pic,
    });

    const createdNews = await news.save();

    res.status(201).json(createdNews);
  }
});

//@description     Approve single News
//@route           POST /api/news/admin/approve/:id
//@access          Private
const approveNews = asyncHandler(async (req, res) => {
  const news = await TempNews.findById(req.params.id);

  if (news) {
    const shiftNews = new News({
      user: news.user,
      title: news.title,
      content: news.content,
      category: news.category,
      source: news.source,
      location: news.source,
      pic: news.pic,
    });
    await shiftNews.save();

    await news.remove();
    res.json({ message: "News Approved", success: true });
  } else {
    res.status(404);
    throw new Error("News not Found");
  }
});

//@description     Dispprove single News
//@route           DELETE /api/news/admin/approve/:id
//@access          Private
const disapproveNews = asyncHandler(async (req, res) => {
  const news = await TempNews.findById(req.params.id);

  if (news) {
    await news.remove();
    res.json({ message: "News DisApproved and Deleted", success: true });
  } else {
    res.status(404);
    throw new Error("News not Found");
  }
});

export { createTempNews, approveNews, disapproveNews, getApproveNews };
