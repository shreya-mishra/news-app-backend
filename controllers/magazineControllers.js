import Magazine from "../models/magazineModel.js";
import asyncHandler from "express-async-handler";

// @desc    Get all magazine
// @route   GET /api/magazine
// @access  Public
const getMagazine = asyncHandler(async (req, res) => {
  const magazine = await Magazine.find();
  res.json(magazine);
});

// @desc    Create magazine
// @route   GET /api/magazine/admin/create
// @access  Private only admins
const createMagazine = asyncHandler(async (req, res) => {
  const files = req.files;
  let imagesPaths = [];
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

  if (files) {
    files.map((file) => {
      imagesPaths.push(`${basePath}${file.filename}`);
    });
  }

  const magazine = new Magazine({
    user: req.user._id,
    pics: imagesPaths,
  });

  const createdMagazine = await magazine.save();

  res.status(201).json(createdMagazine);
});

// @desc    Delete any magazine
// @route   DELETE /api/magazine/admin/:id
// @access  Private
const deleteAnyMagazine = asyncHandler(async (req, res) => {
  const magazine = await Magazine.findById(req.params.id);

  if (magazine) {
    await magazine.remove();
    res.json({ message: "Magazine Removed" });
  } else {
    res.status(404);
    throw new Error("Magazine not Found");
  }
});

export { getMagazine, createMagazine, deleteAnyMagazine };