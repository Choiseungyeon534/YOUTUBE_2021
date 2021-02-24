const express = require('express');
const router = express.Router();
const { Like } = require("../models/Like");
const { Dislike } = require("../models/Dislike");

//=================================
//            Like
//=================================

router.post("/getLikes", (req, res) => {
  
    let variable = {}

    if(req.body.videoId) {
        variable={ videoId: req.body.videoId}
    } else if(req.body.commentId) {
        variable={ commentId: req.body.commentId}
    } else {

    }

    Like.find(variable)
        .exec((err, likes) => {
            if(err) return res.status(400).send(err)
            res.status(200).json({ success: true, likes })
        })
});

router.post("/getDislikes", (req, res) => {
  
    let variable = {}

    if(req.body.videoId) {
        variable={ videoId: req.body.videoId}
    } else if(req.body.commentId) {
        variable={ commentId: req.body.commentId}
    } else {
        
    }

    Dislike.find(variable)
        .exec((err, dislikes) => {
            if(err) return res.status(400).send(err)
            res.status(200).json({ success: true, dislikes})
        })
});

router.post("/upLike", (req, res) => {
  
    let variable = {}

    if(req.body.videoId) {
        variable={ videoId: req.body.videoId, userId: req.body.userId}
    } else if(req.body.commentId) {
        variable={ commentId: req.body.commentId, userId: req.body.userId}
    } else {
        
    }
    // Like collection에다가 정보를 넣어 줄거예요.

    const like = new Like(variable)

    like.save((err, likeResult) => {
        if (err) return res.json({ success: false, err })
        

        // 만약에 Dislike에 이미 클릭이 돼 있다면, Dislike을 1 줄여준다.
        Dislike.findOneAndDelete(variable)
            .exec((err, disLikeResult) => {
                if (err) return res.status(400).json({ success: false, err })
                res.status(200).json({ success: true})
            })
    })

});

router.post("/unLike", (req, res) => {

    let variable = {}

    if(req.body.videoId) {
        variable={ videoId: req.body.videoId, userId: req.body.userId}
    } else if(req.body.commentId) {
        variable={ commentId: req.body.commentId, userId: req.body.userId}
    } else {
        
    }

    Like.findOneAndDelete(variable)
        .exec((err, result) => {
            if (err) return res.status(400).json({ success: false, err })
            res.status(200).json({ success: true, result})
        })

})

router.post("/unDislike",(req, res) => {

    let variable = {}

    if(req.body.videoId) {
        variable={ videoId: req.body.videoId, userId: req.body.userId}
    } else if(req.body.commentId) {
        variable={ commentId: req.body.commentId, userId: req.body.userId}
    } else {
        
    }

    Dislike.findOneAndDelete(variable)
        .exec((err, result) => {
            if (err) return res.status(400).json({ success: false, err })
            res.status(200).json({ success: true, result })
        })

})

router.post("/upDislike", (req, res) => {
  
    let variable = {}

    if(req.body.videoId) {
        variable={ videoId: req.body.videoId, userId: req.body.userId}
    } else if(req.body.commentId) {
        variable={ commentId: req.body.commentId, userId: req.body.userId}
    } else {
        
    }

    // Dislike collection에다가 정보를 넣어 줄거예요.

    const dislike = new Dislike(variable)

    dislike.save((err, dislikeResult) => { 
        if(err) return res.json({ success: false, err })
        

        // 만약에 Like에 이미 클릭이 돼 있다면, Like을 1 줄여준다.
        Like.findOneAndDelete(variable)
            .exec((err, likeResult) => {
                if(err) return res.status(400).json({ success: false, err })
                res.status(200).json({ success: true})
            })
    })

});

module.exports = router;
