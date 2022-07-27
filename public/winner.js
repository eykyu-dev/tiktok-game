// when this page is opened, get the most recently added video and show it.
// function is defined in video.js
let divElmt = document.getElementById("tiktokDiv");

let reloadButton = document.getElementById("reload");
// set up button to reload video in "tiktokDiv"
reloadButton.addEventListener("click",function () {
  reloadVideo(tiktokDiv);
});



// always shows the same hard-coded video.  You'll need to get the server to 
// compute the winner, by sending a 
// GET request to /getWinner,
// and send the result back in the HTTP response.

sendGetRequest("/getWinner")
  .then(function (response) {
    console.log(response)
    document.getElementById("header").textContent += response.nickname;
    showWinningVideo(response.url)
  })
  .catch(function (error) {
     console.error('Error:', error);
});



function showWinningVideo(url) {
  
  let winningUrl = url
  addVideo(winningUrl, divElmt);
  loadTheVideos();
}
