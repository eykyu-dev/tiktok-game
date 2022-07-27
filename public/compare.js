let videoElmts = document.getElementsByClassName("tiktokDiv");

let reloadButtons = document.getElementsByClassName("reload");
let heartButtons = document.querySelectorAll("div.heart");

let nextButton = document.getElementById("nextbutton");
nextButton.addEventListener("click",function() { sendPref() });

let better = -1;
let worse = -1;


for (let i=0; i<2; i++) {
  let reload = reloadButtons[i]; 
  reload.addEventListener("click",function() { reloadVideo(videoElmts[i]) });
} // for loop

heartButtons[0].addEventListener("click", function() {better0()})
heartButtons[1].addEventListener("click", function() {better1()})

function better0(){
  heartButtons[1].classList.add("unloved");
  heartButtons[0].classList.add("loved");
  heartButtons[1].childNodes[0].dataset.prefix = "far"
  heartButtons[0].childNodes[0].dataset.prefix = "fas"
  better =videos[0].rowIdNum
  worse = videos[1].rowIdNum
}

function better1(){
  heartButtons[0].classList.add("unloved");
  heartButtons[1].classList.add("loved");
  heartButtons[0].childNodes[0].dataset.prefix = "far"
  heartButtons[1].childNodes[0].dataset.prefix = "fas"
  better =videos[1].rowIdNum
  worse = videos[0].rowIdNum
}

heartButtons[1].classList.add("unloved");
heartButtons[0].childNodes[0].dataset.prefix = "fas"
// hard-code videos for now
// You will need to get pairs of videos from the server to play the game.
let urls = [];
let videos = [];

function sendPref(){
  if(better > -1 && worse > -1){
    let obj = new Object()
    obj.better = better
    obj.worse = worse
    sendPostRequest("/insertPref", obj)
    .then(function (response){
      if(response == "continue"){
        location.reload();
      }
      if(response == "winner"){
        window.location = "winner.html";
      }
    })
    .catch(function (error) {
     console.error('Error:', error);
    })
  }
}

sendGetRequest("/getTwo")
  .then(function (response) {
    console.log("gotTwoVids");
    videos.push(response[0]);
    videos.push(response[1]);
    let urls = [];
    urls[0] = response[0].url;
    urls[1] = response[1].url;
    for (let i=0; i<2; i++) {
      addVideo(urls[i],videoElmts[i]);
    }
    // load the videos after the names are pasted in! 
    loadTheVideos();
  })
  .catch(function (error) {
     console.error('Error:', error);
});



    