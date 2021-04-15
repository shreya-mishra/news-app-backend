import asyncHandler from "express-async-handler";
import Viral from "../models/viralModel.js";

// @desc    Get all viral
// @route   GET /api/viral
// @access  Public
const getViral = asyncHandler(async (req, res) => {
    const viral = await Viral.find()
        .populate("user")
        .populate("comments.postedBy", "_id name pic");
    res.json(viral);
});

//@description     Create single Viral
//@route           POST /api/create
//@access          Private - Admin
const createViral = asyncHandler(async (req, res) => {
    const { pic } = req.body;

    if (!pic) {
        res.status(400);
        throw new Error("Please Fill all the feilds");
    } else {
        const viral = new Viral({
            user: req.user._id,
            pic,
        });

        const createdViral = await viral.save();

        res.status(201).json(createdViral);
    }
});

// @desc    Delete a viral by owner user or admin
// @route   DELETE /api/viral/:id
// @access  Private
const deleteViral = asyncHandler(async (req, res) => {
    const viral = await Viral.findById(req.params.id);

    if (viral.user.toString() !== req.user._id.toString() || !req.user.isAdmin) {
        res.status(401);
        throw new Error("You can't perform this action");
    }

    if (viral) {
        await viral.remove();
        res.json({ message: "Viral Removed" });
    } else {
        res.status(404);
        throw new Error("Viral not Found");
    }
});

// @desc    Delete any viral
// @route   DELETE /api/viral/admin/:id
// @access  Private
const deleteAnyViral = asyncHandler(async (req, res) => {
    const viral = await Viral.findById(req.params.id);

    if (viral) {
        await viral.remove();
        res.json({ message: "Viral Removed" });
    } else {
        res.status(404);
        throw new Error("Viral not Found");
    }
});

// @desc    Like any viral
// @route   PUT /api/viral/like
// @access  Private
const likeViral = asyncHandler(async (req, res) => {
    const { postId } = req.body;

    const like = await Viral.findByIdAndUpdate(
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
        throw new Error("Viral not Found");
    } else {
        res.json(like);
    }
});

// @desc    Unlike the viral
// @route   PUT /api/viral/unlike
// @access  Private
const unlikeViral = asyncHandler(async (req, res) => {
    const { postId } = req.body;

    const like = await Viral.findByIdAndUpdate(
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
        throw new Error("Viral not Found");
    } else {
        res.json(like);
    }
});

// @desc    Comment on any viral
// @route   PUT /api/viral/comment
// @access  Private
const commentViral = asyncHandler(async (req, res) => {
    const comment = {
        text: req.body.text,
        postedBy: req.user._id,
    };

    const { postId } = req.body;

    const commentMade = await Viral.findByIdAndUpdate(
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
        throw new Error("Viral not Found");
    } else {
        res.json(commentMade);
    }
});

// @desc    Delete Comment on any viral
// @route   PUT /api/viral/deletecomment
// @access  Private
const delCommentViral = asyncHandler(async (req, res) => {
    const { postId, _id } = req.body;

    const commentMade = await Viral.findByIdAndUpdate(
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
        throw new Error("Viral not Found");
    } else {
        res.json(commentMade);
    }
});

export {
    getViral,
    createViral,
    deleteAnyViral,
    deleteViral,
    likeViral,
    unlikeViral,
    commentViral,
    delCommentViral,
};