'use strict'
// index.js
// This is our main server file

// A static server using Node and Express
const express = require("express");

// local modules
const db = require("./sqlWrap");
const win = require("./pickWinner");


// gets data out of HTTP request body 
// and attaches it to the request object
const bodyParser = require('body-parser');


/* might be a useful function when picking random videos */
function getRandomInt(max) {
  let n = Math.floor(Math.random() * max);
  // console.log(n);
  return n;
}

async function getVideos() {
  const dumpCmd = "SELECT * from VideoTable";
  try {
    let vids = await db.all(dumpCmd);
    return vids;
  } catch (err) {
    console.log("grab error", err);
  }
}

async function getTable(){
  const dumpCmd = "SELECT * from PrefTable";
  try {
    let vids = await db.all(dumpCmd);
    return vids;
  } catch (err) {
    console.log("grab error", err);
  }
}

async function getVidI(j){
  const dumpCmd = "SELECT " + j + " from VideoTable";
  try {
    let vids = await db.all(dumpCmd);
    return vids;
  } catch (err) {
    console.log("grab error", err);
  }
}
async function insertVideoPref(pref_json){
  console.log("Inserting into PrefTable")
  const sql = "insert into PrefTable (better, worse) values (?,?)"
  await db.run(sql, [pref_json.better, pref_json.worse]);
}

/* start of code run on start-up */
// create object to interface with express
const app = express();

// Code in this section sets up an express pipeline

// print info about incoming HTTP request 
// for debugging
app.use(function(req, res, next) {
  console.log(req.method, req.url);
  next();
})
// make all the files in 'public' available 
app.use(express.static("public"));

// if no file specified, return the main page
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/compare.html");
});

// Get JSON out of HTTP request body, JSON.parse, and put object into req.body
app.use(bodyParser.json());

app.get("/getTwo", async function(req, res) {
  console.log("GET /TwoVids")
  let videos = await getVideos();
  let video1 = videos[getRandomInt(videos.length)]
  let video2 = videos[getRandomInt(videos.length)]
  res.send([video1, video2])
});

app.get("/getWinner", async function(req, res) {
  console.log("GET /Winner");
  try {
    // change parameter to "true" to get it to computer real winner based on PrefTable 
    // with parameter="false", it uses fake preferences data and gets a random result.
    // winner should contain the rowId of the winning video.
    let winner = await win.computeWinner(8, true);
    let videos = await getVideos();
    
    // you'll need to send back a more meaningful response here.
    res.send(videos[winner])
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/insertPref", async function(req, res) {
  console.log("POST /insertPref");
  insertVideoPref(req.body);
  let table = await getTable();
  console.log(table.length)
  if(table.length == 15){
    res.send("winner");
  }
  else{
    res.send("continue")
  }
}); 

// Page not found
app.use(function(req, res) {
  res.status(404);
  res.type('txt');
  res.send('404 - File ' + req.url + ' not found');
});

// end of pipeline specification

// Now listen for HTTP requests
// it's an event listener on the server!
const listener = app.listen(3000, function() {
  console.log("The static server is listening on port " + listener.address().port);
});

