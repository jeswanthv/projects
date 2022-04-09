const router = require("express").Router();
const Category = require("../models/Category");

router.post("/", async (req, res) => {
  const newCat = new Category(req.body);
  try {
    const savedCat = await newCat.save();
    res.status(200).json(savedCat);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/", async (req, res) => {
  try {
    const allcategory = await Category.find();
    res.status(200).json(allcategory);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
