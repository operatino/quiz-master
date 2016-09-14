'use strict';

(function (window, $) {

  var Player = function () {
    this._video,
    this._seekBar,
    this._progress,
    this._qBar,
    this._questions,
    this._videoUrl,
    this._answers,
    this._activeQuestion,
    this._qBarPrinted = false,
    this._initiated = false,
    this._config,
    this._template,
    this._qBlock,
    this._listenButtons = false,
    this._score = 0,
    this._stored = false,
    this._isPlaying = true,
    this._aBlock;
    this._progressTimeout;
    this._progressTrack;
    this._warning;
    this._warningTime;
    this._progressTimeoutValue = 0;
  };

  Player.prototype.setDefaultValues = function () {
    this._questions = {};
    this._answersTime = {};
    this._videoUrl;
    this._answers = {};
    this._initiated = false;
    this._config = {
      startCallback: null,
      stopCallback: null,
      answerCallback: null,
      questionCallback: null
    };
    this._video = document.getElementById("player");
    this._qBar = document.getElementById("q-bar");
    this._seekBar = document.getElementById("seek-bar");
    this._progress = document.getElementById("progress");
    this._template = _.template(document.getElementById('question-template').innerHTML);
    this._qBarTemplate = _.template(document.getElementById('qbar-template').innerHTML);
    this._qBlock = document.getElementById("question");
    this._aBlock = document.getElementById("answer");
    this._progressTimeout = document.getElementById("progress-timeout");
    this._progressTrack = document.querySelector(".progress-track");
    this._warning = document.querySelector(".question-upcoming-notification");
    this._warningTime = this._warning.querySelector(".time");

    return this;
  };

  Player.prototype.init = function (url, questions, config) {
    if (this._initiated) {
      return this;
    }

    this.setDefaultValues().setEvents();

    this._videoUrl = url;

    var _this = this;

    Object.keys(questions).forEach(function (id) {
      var question = questions[id];
      var time = String(id - (question.offset || 30));
      question.wasShown = false;
      question.id = time
      _this._questions[time] = question;
      _this._answersTime[String(id)] = {
        id: time,
        wasShown: false
      };
    });
    this._initiated = true;

    Object.assign(this._config, config);

    return this.startPlayback().setKeyEvents();
  };

  Player.prototype.startPlayback = function () {
    this._video.setAttribute('src', this._videoUrl);
    this._video.querySelector('source').setAttribute('src', this._videoUrl);
    this._video.play();

    return this;
  };

  Player.prototype.setEvents = function () {
    this._video.addEventListener("timeupdate", this.timeUpdate.bind(this));
    this._video.addEventListener("ended", this.scoreBoard.bind(this));
    return this;
  };

  Player.prototype.scoreBoard = function () {
    var _this = this;
    setTimeout(function () {
      _this.redirectTo('./end.html');
    }, 1000);
  }

  Player.prototype.timeUpdate = function () {
    var currentTime = Math.ceil(this._video.currentTime);
    var value = (100 / this._video.duration) * currentTime;

    // Update the slider value
    this._progress.style.width = Math.floor(value) + '%';

    this.checkQuestion(currentTime);
    return this;
  };

  Player.prototype.printQbar = function (doExpand) {
    var duration = Math.ceil(this._video.duration);
    var _this = this;

    var qBarObj = Object.keys(this._questions).map(function (id) {
      var question = _this._questions[id];
      return {
        time: id,
        isCorrect: question.isCorrect,
        left: Math.floor((Number(id) / duration) * 100),
        width: Math.ceil(((question.offset || 5) / duration) * 100) + '%',
        isActive: (doExpand && String(_this._activeQuestion) === String(id) ? true : false)
      };
    });


    var qBarHTML = this._qBarTemplate({answers: qBarObj});
    this._qBar.innerHTML = qBarHTML;

    return this;
  };

  Player.prototype.checkQuestion = function (currentTime) {
    var _currentTime = String(currentTime);
    var warningTimeout = 3;

    if (!this._qBarPrinted) {
      this.printQbar(false);
      this._qBarPrinted = true;
    }

    if (this._questions[String(currentTime + warningTimeout)]) {
      return this.showWarning(warningTimeout);
    }

    if (this._questions[_currentTime]) {
      var question = this._questions[_currentTime];

      if (!question.wasShown) {
        question.wasShown = true;
        this.hideWarning();
        return this.showQuestion(_currentTime, question);
      }
    }

    if (this._answersTime[_currentTime]) {
      var answer = this._answersTime[_currentTime];

      if (!answer.wasShown) {
        answer.wasShown = true;
        return this.showAnswer(_currentTime, answer);
      }
    }
    return this;
  };

  Player.prototype.showWarning = function (timeout) {
    this._warning.classList.remove('hidden');
    this._warningTime.innerHTML = timeout;

    var _this = this;
    clearInterval(_this.warningTextInterval);
    this.warningTextInterval = setInterval(function() {
      _this._warningTime.innerHTML = Number(_this._warningTime.innerHTML) - 1;
    }, 1000);

    this.warningTextTimeout = setTimeout(function() {
      clearInterval(_this.warningTextInterval);
    }, (timeout * 1000) - 100)
  };
  Player.prototype.hideWarning = function () {
    this._warning.classList.add('hidden');
  };

  Player.prototype.storeResults = function () {
    this._stored = true;
    var _this = this;

    setTimeout(function () {
      Score.install();
      Score.setScore(1, Score.getFakeUserName(), Object.keys(_this._questions).map(function (id) {
        var question = _this._questions[id];
        return {
          name: question.question,
          score: question.isCorrect ? 1 : 0
        };
      }));
    }, 1000);
  };
  
  Player.prototype.handleAnswerClick = function (event) {
    var _el = event.target;
    if (_el) {
      var answer = event.target.getAttribute('rel');

      return this.handleResponse(_el, answer);
    }
    
    return this;
  };

  Player.prototype.showQuestion = function (time, question) {
    question.finished = false;
    question.isCorrect = undefined;
    question.score = 0;
    this._listenButtons = true;
    var questionHTML = this._template(question);

    this._activeQuestion = question.id;
    this._qBlock.innerHTML = questionHTML;
    this._qBlock.style.display = 'block';
    this._video.pause();
    this.startAnsweringTimeout();
    
    for (var i = 0; i < 4; ++i) {
      document.getElementById('answer-' + i).addEventListener('click', this.handleAnswerClick.bind(this), true);
    }

    return this.printQbar(true);
  };

  Player.prototype.startAnsweringTimeout = function() {
    var _this = this;
    var timeout = 7;

    this._progressTimeoutValue = 0;
    var currentValue = this._progressTimeoutValue;
    this._progressTrack.style.transform = 'translateX(-100%)';
    this._progressTimeout.style.display = 'block';

    this.answerInterval = setInterval(function() {
      _this._progressTrack.style.transform = 'translateX(' + (((currentValue++ + 1) / timeout) * 100) + '%)';
    }, 1000);

    this.answerTimeout = setTimeout(function() {
      clearInterval(_this.answerInterval);

      _this.hideQuestions();
      _this._answers[String(_this._activeQuestion)] = 'timeout';

    }, (timeout + 1) * 1000);
  },

  Player.prototype.setKeyEvents = function () {
    document.body.addEventListener('keyup', this.handleKeyUp.bind(this));
    return this;
  };

  Player.prototype.redirectTo = function (url) {
    window.location.href = url;
  };

  Player.prototype.playPause = function () {
    if (this._isPlaying) {
      this._video.pause();
      this._isPlaying = false;
      return this;
    }

    this._video.play();
    this._isPlaying = true;

    return true;
  };

  Player.prototype.handleKeyUp = function (event) {

    var key = event.which || event.keyCode;

    if (key === 413 || key === 48) {
      return this.redirectTo('end.html');
    }

    if (key === 415 || key === 13) {
      return this.playPause();
    }

    if (key === 461 || key === 27) {
      return this.redirectTo('index.html');
    }

    if (this._listenButtons) {
      var answer;

      if (key === 49) {
        answer = 0;
      } else if (key === 50) {
        answer = 1;
      } else if (key === 51) {
        answer = 2;
      } else if (key === 52) {
        answer = 3;
      }

      if (typeof answer === 'number') {
        var element = document.getElementById('answer-' + answer);

        return this.handleResponse(element, answer);
      }
    }

    return this;
  };

  Player.prototype.handleResponse = function (element, answer) {
    var _this = this;
    this._answers[String(this._activeQuestion)] = answer;
    var elements = document.querySelectorAll('[class^=answer]');
    for (var i = 0, limit = elements.length; i < limit; i++) {
      elements[i].classList.remove('selected');
    }
    element.classList.add('selected');


    clearTimeout(this._hideQuestionTimeout);
    this._hideQuestionTimeout = setTimeout(function() {
      _this.hideQuestions();
    }, 2000);
  };

  Player.prototype.hideQuestions = function () {
    this._qBlock.style.display = 'none';
    this._progressTimeout.style.display = 'none';
    this._qBlock.innerHTML = '';
    this._listenButtons = false;
    this._video.play();
    clearTimeout(this.answerTimeout);
    clearInterval(this.answerInterval);

    return this;
  };

  Player.prototype.hideAnswer = function () {
    this._aBlock.style.display = 'none';
    this._aBlock.innerHTML = '';

    this._video.play();

    return this;
  };

  Player.prototype.showAnswer = function (time, answer) {
    var answerObject = this._questions[answer.id];
    var _this = this;
    var soundOEl;
    answerObject.finished = true;
    answerObject.isCorrect = String(this._answers[String(answer.id)]) === String(answerObject.correctAnswer);

    if (answerObject.isCorrect) {
      this._score += 1;
      soundOEl = document.getElementById('audio-correct');
    } else {
      soundOEl = document.getElementById('audio-wrong');
    }

    answerObject.score = this._score;

    this._video.pause();

    var answerHTML = this._template(answerObject);
    this._aBlock.innerHTML = answerHTML;
    this._aBlock.style.display = 'block';
    this._aBlock.classList.add('anticipation');
    this._aBlock.classList.add('anticipation2');

    soundOEl.play();

    setTimeout(function () {
      _this._aBlock.classList.remove('anticipation');
    }, 400);
    setTimeout(function () {
      _this._aBlock.classList.remove('anticipation2');
    }, 700);
    setTimeout(function () {
      _this.hideAnswer().printQbar(false);

      if (Object.keys(_this._answers).length === Object.keys(_this._questions).length && !_this._stored) {
        _this.storeResults();
      }
    }, 5000);

    return this;
  };

  window.Player = new Player();

})(window, jQuery);

