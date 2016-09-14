Number.prototype.toHHMMSS = function () {
  var sec_num = parseInt(this, 10); // don't forget the second param
  var hours   = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (hours   < 10) {hours   = "0"+hours;}
  if (minutes < 10) {minutes = "0"+minutes;}
  if (seconds < 10) {seconds = "0"+seconds;}
  return hours+':'+minutes+':'+seconds;
};

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

    this.$videoEl.volume = 0;

    console.log(this.$el.find('#add-question'));

    //Init vid
/*    var mediaElement = document.getElementById('mediaElementID');
    mediaElement.seekable.start();  // Retourneert de starttijd (in seconden)
    mediaElement.seekable.end();    // Retourneert de einddtijd (in seconden)
    mediaElement.currentTime = 122; // Ga naar 122 seconden
    mediaElement.played.end();      // Retourneert het aantal seconden dat de browser heeft afgespeeld*/

    setInterval(function() {
      _this.$el.find('#time').html(_this.$videoEl.currentTime.toHHMMSS());
    }, 200);

    this.$el.find('#pause').click(function(e) {
      e.preventDefault();
      _this.$videoEl.pause();
    });

    this.$el.find('#play').click(function(e) {
      e.preventDefault();
      _this.$videoEl.play();
    });

    this.$el.find('#add-question').click(function(e) {

      e.preventDefault();

      _this.$videoEl.pause();

      _this.$form.show();
    });

    this.$el.find('#save-form').click(function(e) {
      e.preventDefault();
      var q = {
        id: 'row' + new Date().getTime(),
        question: _this.$el.find('input[name=question-input]').val(),
        time: _this.$videoEl.currentTime.toHHMMSS()
      }



      _this.addQuestion(q);
      _this.$form[0].reset();
      _this.$form.hide();

      //remove-row
/*      _this.$el.find('.remove-row').click(function(e) {
        console.log('Click');
        $(this).closest("tr").remove();
      });*/

    });

    this.$el.find('#cancel-form').click(function(e) {
      e.preventDefault();
      _this.$form[0].reset();
      _this.$videoEl.play();
      _this.$form.hide();
    });
    console.log(this.$videoEl);
  }

  this.addQuestion = function(obj) {

    if (obj.question.length > 1) {

      _this.$questions.prepend('<tr data-question="' + JSON.stringify(obj) + '" class="' + obj.id + '"><td>' + obj.time + '</td><td>' + obj.question + '</td><td><span class="edit-row">edit</span> - <span class="remove-row">remove</span></td></tr>')

      _this.$el.find('.' + obj.id).click(function(e) {
        e.preventDefault();
        $(this).closest("tr").remove();
      });

      _this.$el.find('.' + obj.id + ' .edit-row').click(function(e) {
        e.preventDefault();
        e.stopPropagation();
        _this.$videoEl.pause();

        console.log('-->', obj.question);

        _this.$form.show();
      });
    }

    _this.$videoEl.play();
  };

  this.startVideo = function() {

  };

  this.createQuestion = function() {

  };

  return this;
};

