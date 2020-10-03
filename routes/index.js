var express = require('express');
var router = express.Router();
const multer = require('multer');

const fs = require('fs');
const { promisify } = require('util');
const pipeline = promisify(require('stream').pipeline);

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express',
  });
});
const upload = multer();
const MongoClient = require('mongodb').MongoClient;
const uri =
  'mongodb+srv://rider:XBy6BoY1A6WyHZ8e@cluster1.fwfle.mongodb.net/events?retryWrites=true&w=majority';
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const eventCollections = client.db('events').collection('programs');
  const url = req.protocol + '://' + req.get('host');
  router.post('/upload', upload.single('file'), async function (
    req,
    res,
    next
  ) {
    const {
      file,
      body: { name, date },
    } = req;
    const fileName = name + file.detectedFileExtension;
    await pipeline(
      file.stream,
      fs.createWriteStream(`${__dirname}/../public/images/${fileName}`)
    );
    res.send(req.file);
    console.log(fileName);
    console.log({
      url: `${__dirname}/images/${fileName}`,
      name: name,
    });

    const eventData = {
      url: url + '/public/' + '/images/' + fileName,
      name: name,
      date: date,
    };

    eventCollections.insertOne(eventData).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
});

router.get('/images', (req, res) => {
  res.send(`${__dirname}/../public/images`);
});

module.exports = router;
