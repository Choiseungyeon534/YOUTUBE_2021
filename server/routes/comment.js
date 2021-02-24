const express = require('express');
const router = express.Router();
const {Comment} = require("../models/Comment");

router.post("/saveComment", (req, res) => {
    
    const comment = new Comment(req.body);

    comment.save((err, c) => {
        if (err) return res.json({ success: false, err })

        Comment.find({ _id: c._id }) //저장 후 id를 이용하여 바로 해당 witer정보를 찾는다.
        .populate("writer")
        .exec((err, result) => {
          if (err) return res.json({ success: false, err });
          res.status(200).json({ success: true, result });
            })
    })
  });
  router.post("/getComments", (req, res) => {
    
    Comment.find({"postId": req.body.videoId})
    .populate('writer')
    .exec((err, comments) => {
       if(err) return res.status(400).send(err)
       res.status(200).json({success: true, comments})
    })
  });
  
  module.exports = router;