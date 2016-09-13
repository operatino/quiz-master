
(function(){
  var catalogEl = document.querySelector('.catalog');
  var tiles = [];

  var init = function () {
    getData();
  };

  var getData = function () {
    $.ajax('https://api.lgi.io/kraken/v2/schedule/data/NL/vods?limit=32&video.category=speelfilm&video.subcategory=drama&fields=endOfAvailability,entitlementCodes,id,imi,lang,selfLink,startOfAvailability,video.selfLink,video.title,video.imageLink,video.category,video.imdbRating,video.subcategory', {
      headers: {
        'x-auth-id': 'appathon2016',
        'x-auth-key': '9dece560cb977e8b922c05122be592dbedae848ecac120b41e7f4c30860cac6c'
      },
      complete: handleGetDataComplete
    });
  };

  var handleGetDataComplete = function (data) {
    drawTiles(data.responseJSON.data);
    window.Nav.init('a.tile, .facebook', 6);
    document.querySelector('.page.loading').classList.remove('loading');
  };

  var drawTiles = function (vods) {
    if (!vods.length) {
      return;
    }

    var enteredTitles = [];
    for (var i = 0, limit = vods.length, title; i < limit; i++) {
      title = vods[i].video.title;
      if (enteredTitles.indexOf(title) === -1 && enteredTitles.length <= 16) {
        drawTile(vods[i]);
        enteredTitles.push(title);
      }
    }
    tiles = document.querySelectorAll('.tile');
  };

  var drawTile = function(video) {

    var template = document.querySelector('.tile').cloneNode(true);
    var image = template.querySelector('.tile--poster');
    var title = template.querySelector('.tile--title');


    image.src = video.video.imageLink.href;
    title.innerHTML = video.video.title;
    template.href = 'player.html?videoId=' + video.id;

    catalogEl.appendChild(template);

  };


  init();

})();

var loginFB = function(el) {
  var classes = el.className;
  if (classes.match(/loading/g)) {
    return;
  }
  
  el.className = 'facebook loading';
  el.innerText = 'Loading...';
  
  setTimeout(function () {
    window.location.href = './fb.html'
  }, 2000);
};
