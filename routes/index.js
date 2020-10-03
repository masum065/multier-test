var express = require('express');
var router = express.Router();
const multer = require('multer');

const fs = require('fs');
const {
  promisify
} = require('util');
const pipeline = promisify(require('stream').pipeline);


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

const upload = multer();
router.post("/upload", upload.single("file"), async function (req, res, next) {
  const {
    file,
    body: {
      name
    }
  } = req;
  const fileName = name + file.detectedFileExtension;
  await pipeline(
    file.stream,
    fs.createWriteStream(`${__dirname}/../public/images/${fileName}`)
  );
  res.send(req.file);
  console.log(fileName);
  console.log(`/images/${fileName}`);
});


router.get('/images', (req, res) => {
  res.send(`${__dirname}/../public/images`)
})

module.exports = router;