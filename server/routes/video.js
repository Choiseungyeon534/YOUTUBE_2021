const express = require('express');
const router = express.Router();
const multer = require('multer');
var ffmpeg = require('fluent-ffmpeg');

const { Video_ } = require("../models/Video_");

const { auth } = require("../middleware/auth");
const Subscriber = require('../models/Subscriber');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.mp4') {
            return cb(res.status(400).end('only jpg, png, mp4 is allowed'), false);
        }
        cb(null, true)
    }
})

var upload = multer({ storage: storage }).single("file")
//=================================
//             Video
//=================================
 
router.post("/getSubscriptionVideos", (req, res) => {
  //자신의 아이디를 가지고 구독하는 사람들을 찾는다.
  Subscriber.find({ userFrom: req.body.userFrom })
  .exec((err, subscriberInfo) => {
      console.log(subscriberInfo);
      if (err) return res.status(400).send(err);

      let subscribedUser = [];

      subscriberInfo.map((subscriber, index) => {
        subscribedUser.push(subscriber.userTo);
      });
      //찾은 사람들의 비디오를 가지고온다.
      Video_.find({ writer: { $in: subscribedUser } })
        .populate("writer")
        .exec((err, videos) => {
          if (err) return res.status(400).send(err);
          res.status(200).json({ success: true, videos });
        });
    }
  );
});

  


 router.post("/uploadfiles", (req, res) => {
// 비디오를 서버에 저장한다.
  upload(req, res, err => {
      if (err) {
          return res.json({ success: false, err })
      }
      return res.json({ success: true, filePath: res.req.file.path, fileName: res.req.file.filename })
  })

});

router.post('/uploadVideo', (req, res) => {
  
  //비디오 정보들을 저장한다.

  const video = new Video_(req.body);

  video.save((err, doc) => {
    if(err) return res.json({ success: false, err})
    res.status(200).json({ success: true })
  })

})
router.get("/getVideos", (req, res) => {
  // 비디오를 DB에서 가져와서 클라이언트에 보낸다.
  
  Video_.find()
    .populate('writer')
    .exec((err, videos) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, videos})
    })

})
router.post("/getVideoDetail", (req, res) => {
 
  Video_.findOne({"_id": req.body.videoId })
    .populate('writer')
    .exec((err, videoDetail) => {
      if (err) return res.status(400).send(err)
      res.status(200).json({ success: true, videoDetail})
    })
})
router.post("/thumbnail", (req, res) => {
    let filePath = "";
    let fileDuration = "";
  
     // 비디오 전체 정보 추출
     console.log(req.body)
    ffmpeg.ffprobe(req.body.url, function(err, metadata) {
      
      console.dir(metadata);
      console.log(metadata.format.duration);
  
      fileDuration = metadata.format.duration;
    });
  
    //썸네일 생성, 비디오 길이 추출
    ffmpeg(req.body.url)
      .on("filenames", function (filenames) {
        console.log("Will generate " + filenames.join(", "));
        filePath = "uploads/thumbnails/" + filenames[0];
      })
      .on("end", function () {
        console.log("Screenshots taken");
        return res.json({
          success: true,
          url: filePath,
          fileDuration: fileDuration,
        });
      })
      .on("error", function (err) {
        console.error(err);
        return res.json({ success: false, err });
      })
      .screenshots({
        // Will take screens at 20%, 40%, 60% and 80% of the video
        count: 3,
        folder: "uploads/thumbnails",
        size: "320x200",
        // %b input basename ( filename w/o extension )
        filename: "thumbnail-%b.png",
      });
  });

module.exports = router;
