const router = require("express").Router();

const User = require("../models/User");
const bcrypt = require("bcrypt");

//update

router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(401).json("cannot update account");
  }
});

//delete

router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("user has been deleted");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(401).json("cannot delete account");
  }
});


//Get user

router.get("/:id",async (req,res)=>{
    try{
        const user  = await User.findById(req.params.id);
        const {password,...data} = user._doc;
        res.status(200).json(data)
    }catch(err) {
        res.status(500).json(err);
    }
})


module.exports = router;
