Number.prototype.toHHMMSS = function () {
  var sec_num = parseInt(this, 10); // don't forget the second param
  var hours   = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (hours   < 10) {hours   = "0"+hours;}
  if (minutes < 10) {minutes = "0"+minutes;}
  if (seconds < 10) {seconds = "0"+seconds;}
  return hours+':'+minutes+':'+seconds;
}

function Create() {
  var _this = this;
  this.$el = null;
  //this.currentVideoTime = 0;
  this.$videoEl = null;

  this.init = function($el, url) {
    this.$el = $el;
    this.$videoEl = document.getElementById('video-player');
    this.$form = this.$el.find('#add-question-form');
    this.$questions = this.$el.find('#questions');

    console.log(this.$el.find('#add-question'));

    //Init vid
/*    var mediaElement = document.getElementById('mediaElementID');
    mediaElement.seekable.start();  // Retourneert de starttijd (in seconden)
    mediaElement.seekable.end();    // Retourneert de einddtijd (in seconden)
    mediaElement.currentTime = 122; // Ga naar 122 seconden
    mediaElement.played.end();      // Retourneert het aantal seconden dat de browser heeft afgespeeld*/

    setInterval(function() {
      console.log('Blaaaa111');
      _this.$el.find('#time').html(_this.$videoEl.currentTime.toHHMMSS());
    }, 1000)

    this.$el.find('#add-question').click(function(e) {

      e.preventDefault();

      _this.$videoEl.pause();

      _this.$form.show();
    });

    this.$el.find('#save-form').click(function(e) {
      e.preventDefault();
      var q = {
        question: _this.$el.find('input[name=question]').val(),
        time: _this.$videoEl.currentTime.toHHMMSS()
      }
      _this.addQuestion(q);
      _this.$form[0].reset();
      _this.$form.hide();
    });

    console.log(this.$videoEl);
  }

  this.addQuestion = function(obj) {
    _this.$questions.prepend('<li>' + obj.question + ' ' + obj.time + ' - <span>edit</span> - <span>remove</span></li>')


    _this.$videoEl.play();
  };

  this.startVideo = function() {

  }

  this.createQuestion = function() {

  }

  return this;
};

