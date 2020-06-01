var express = require('express');
var router = express.Router();

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost:27017';
const dbName = 'hospital';

var bpm = 88;
var temp = 35;
var pos = "back";
var alarm = false;

router.get('/', (req, resp)=>{
  resp.render('index', { 
    bpm: "88",
    temp:"35",
    pos:"back",
    alarm:"false"
  });
});


router.get('/update', (req, resp)=>{
  results = [];
  MongoClient.connect(url, (err, client)=>{
    assert.equal(null, err);
    const db = client.db(dbName);

    var cursor = db.collection('patients').find().sort({_id:-1}).limit(10);
    cursor.forEach((doc , err)=>{
      assert.equal(null, err);
      results.push(doc);
    },
    function(){
      client.close();
      resp.json(results);
    })
  });
});

/* GET home page. */
router.post('/',(req, resp)=>{

  bpm  = req.body.bpm;
  temp  = req.body.temp;
  pos  = req.body.pos;
  alarm = req.body.alarm;
  
  let t = new Date();
  let h = t.getHours();
  let m = t.getMinutes();
  let s = t.getSeconds();
  hh = h < 10 ? '0'+h : h;
  mm = m < 10 ? '0'+m : m;
  ss = s < 10 ? '0'+s : s;
  time = hh +":"+mm+":"+ss;

  resp.sendStatus(200);
  MongoClient.connect(url, (err, client)=>{
    assert.equal(null, err);
    console.log("CONNECTED TO DATABASE");

    const db = client.db(dbName);

    db.collection('patients').insertOne({"HeartRate": bpm, 
      "Temperature":temp, "Position":pos, "Alarm":alarm, "Time":time},
      (err,result)=>{
        assert.equal(err, null);
        client.close();
      } 
    );
  });
});

module.exports = router;

