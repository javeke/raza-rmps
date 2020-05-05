var express = require('express');
var router = express.Router();

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'hospital';

var bpm = 88;
var temp = 35;
var pos = "back";

router.get('/', (req, resp)=>{
  resp.render('index', { 
    bpm: "88",
    temp:"35",
    pos:"back"
  });
});


router.get('/update', (req, resp)=>{
  resp.status(200).json({"bpm":bpm, "temp":temp, "pos":pos});
});

/* GET home page. */
router.post('/',(req, resp)=>{
  if(req.body){
    bpm  = req.body.bpm;
    temp  = req.body.temp;
    pos  = req.body.pos;
  } 
  console.log(req.body);
  resp.sendStatus(200);
  MongoClient.connect(url, (err, client)=>{
    assert.equal(null, err);
    console.log("CONNECTED TO DATABASE");

    const db = client.db(dbName);

    db.collection('patients').insertOne({"Heart Rate": req.body.bpm, 
      "Temperature":req.body.temp, "Position":req.body.pos},
      (err,result)=>{
        assert.equal(err, null);
        client.close();
      }
    );
  });
});

module.exports = router;


// const updateDocument = function (db, callback) {
//   // Get the documents collection
//   const collection = db.collection('Student'); // <------ Enter  name for your Database collection where you have 'Student' or leave as is
//   // Update document where a is 2, set b equal to 1
//   collection.updateOne({ a: 2 }
//     , { $set: { b: 1 } }, function (err, result) {
//       assert.equal(err, null);
//       assert.equal(1, result.result.n);
//       console.log("Updated the document with the field a equal to 2");
//       callback(result);
//     });
// }

// // ========== Remove a document ===============================
// //Remove the document where the field a is equal to 3. 
// const removeDocument = function (db, callback) {
//   // Get the documents collection
//   const collection = db.collection('Student'); // <------ Enter  name for your Database collection where you have 'Student' or leave as is
//   // Delete document where a is 3
//   collection.deleteOne({ a: 3 }, function (err, result) {
//     assert.equal(err, null);
//     assert.equal(1, result.result.n);
//     console.log("Removed the document with the field a equal to 3");
//     callback(result);
//   });
// }