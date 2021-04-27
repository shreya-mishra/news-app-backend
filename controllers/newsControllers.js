import News from "../models/newsModel.js";
import asyncHandler from "express-async-handler";

// @desc    Get all news
// @route   GET /api/news
// @access  Public
const getNews = asyncHandler(async (req, res) => {
  const pageDisp = 3;
  const query = req.query;

  console.log(query);

  const news = await News.find(query.category && { category: query.category })
    .limit(parseInt(query.page) * pageDisp)
    .populate("user", "_id phone name email isAdmin pic location")
    .populate("comments.postedBy", "_id name pic");

  const count = await News.count(
    query.category && { category: query.category }
  );

  res.json({ news, count });
});

//@description     Create single News
//@route           POST /api/admin/create
//@access          Private - Admin
const createNews = asyncHandler(async (req, res) => {
  const { title, content, category, source, location, pic, isVideo } = req.body;

  // if (!req.file)
  //   return res.status(400).json({ message: "No image in the request" });
  // const fileName = req.file.filename;
  // const basePath = `${req.protocol}://${req.get(
  //   "host"
  // )}/public/uploads/${fileName}`;

  if (!title || !content || !category || !source || !location || !pic) {
    res.status(400);
    throw new Error("Please Fill all the feilds");
  } else {
    const news = new News({
      user: req.user._id,
      title,
      content,
      category,
      source,
      location,
      pic,
      isVideo: isVideo ? isVideo : false,
      // pic: basePath,
    });

    const createdNews = await news.save();

    res.status(201).json(createdNews);
  }
});

// @desc    Delete a news by owner user or admin
// @route   DELETE /api/news/:id
// @access  Private
const deleteNews = asyncHandler(async (req, res) => {
  const news = await News.findById(req.params.id);

  if (news.user.toString() !== req.user._id.toString() || !req.user.isAdmin) {
    res.status(401);
    throw new Error("You can't perform this action");
  }

  if (news) {
    await news.remove();
    res.json({ message: "News Removed" });
  } else {
    res.status(404);
    throw new Error("News not Found");
  }
});

// @desc    Delete any news
// @route   DELETE /api/news/admin/:id
// @access  Private
const deleteAnyNews = asyncHandler(async (req, res) => {
  const news = await News.findById(req.params.id);

  if (news) {
    await news.remove();
    res.json({ message: "News Removed" });
  } else {
    res.status(404);
    throw new Error("News not Found");
  }
});

// @desc    Like any news
// @route   PUT /api/news/like
// @access  Private
const likeNews = asyncHandler(async (req, res) => {
  const { postId } = req.body;

  const like = await News.findByIdAndUpdate(
    postId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  );

  if (!like) {
    res.status(404);
    throw new Error("News not Found");
  } else {
    res.json(like);
  }
});

// @desc    Unlike the news
// @route   PUT /api/news/unlike
// @access  Private
const unlikeNews = asyncHandler(async (req, res) => {
  const { postId } = req.body;

  const like = await News.findByIdAndUpdate(
    postId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  );

  if (!like) {
    res.status(404);
    throw new Error("News not Found");
  } else {
    res.json(like);
  }
});

// @desc    Comment on any news
// @route   PUT /api/news/comment
// @access  Private
const commentNews = asyncHandler(async (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id,
  };

  const { postId } = req.body;

  const commentMade = await News.findByIdAndUpdate(
    postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  ).populate("comments.postedBy", "_id name pic");

  if (!commentMade) {
    res.status(404);
    throw new Error("News not Found");
  } else {
    res.json(commentMade);
  }
});

// @desc    Delete Comment on any news
// @route   PUT /api/news/deletecomment
// @access  Private
const delCommentNews = asyncHandler(async (req, res) => {
  const { postId, _id } = req.body;

  const commentMade = await News.findByIdAndUpdate(
    postId,
    {
      $pull: { comments: { _id } },
    },
    {
      new: true,
    }
  );

  if (!commentMade) {
    res.status(404);
    throw new Error("News not Found");
  } else {
    res.json(commentMade);
  }
});

export {
  getNews,
  createNews,
  deleteNews,
  deleteAnyNews,
  likeNews,
  unlikeNews,
  commentNews,
  delCommentNews,
};
