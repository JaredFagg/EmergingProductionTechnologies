var GrabElement = document.getElementById("grab");

var images = [ "./public/images/grab.png", "./public/images/hand.png"]

var id = setInterval(change, 1000);

var index = 0;

function change() {
  GrabElement.src = images[index];
  if (index == 1) {
    index = 0;
  } else {
    index++;
  }
}

