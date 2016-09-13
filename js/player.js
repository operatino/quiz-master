'use strict';

(function (window/*, $*/) {
  
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
    this._score = 0,
    this._stored = false,
    this._aBlock;
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
    
    
    return this;
  };
  
  Player.prototype.init = function (url, questions, config) {
    if (this._initiated) {
      console.warn('Player already initiated!');
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
    
    this.startPlayback();
    
    return this;
  };
  
  Player.prototype.startPlayback = function () {
    this._video.setAttribute('src', this._videoUrl);
    this._video.play();
    
    return this;
  };
  
  Player.prototype.setEvents = function () {
    this._video.addEventListener("timeupdate", this.timeUpdate.bind(this));
    return this;
  };
  
  Player.prototype.timeUpdate = function () {
    var currentTime = Math.floor(this._video.currentTime);
    var value = (100 / this._video.duration) * currentTime;

    // Update the slider value
    this._progress.style.width = value + '%';
    
    this.checkQuestion(currentTime);
    return this;
  };
  
  Player.prototype.printQbar = function () {
    var duration = Math.ceil(this._video.duration);
    var _this = this;
    
    var qBarObj = Object.keys(this._questions).map(function (id) {
      var question = _this._questions[id];
      
      return {
        time: id,
        isCorrect: question.isCorrect,
        left: ((Number(id) - question.offset) / duration) * 100
      };
    });
    
    var qBarHTML = this._qBarTemplate({answers: qBarObj});
    this._qBar.innerHTML = qBarHTML;
  };
  
  Player.prototype.checkQuestion = function (currentTime) {
    var _currentTime = String(currentTime);
    
    if (!this._qBarPrinted) {
      this.printQbar();
    }
    
    if (this._questions[_currentTime]) {
      var question = this._questions[_currentTime];
      
      if (!question.wasShown) {
        question.wasShown = true;
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
    
    if (Object.keys(this._answers).length === Object.keys(this._questions).length && !this._stored) {
      return this.storeResults();
    }
    
    return this;
  };
  
  Player.prototype.storeResults = function () {
    this._stored = true;
    var _this = this;
    Score.setScore('1', 'TestUsername', Object.keys(this._questions).map(function (id) {
      var question = _this._questions[id];
      return {
        name: question.question,
        score: question.isCorrect ? 1 : 0
      };
    }));
  };
  
  Player.prototype.showQuestion = function (time, question) {
    question.finished = false;
    question.isCorrect = undefined;
    question.score = 0;
    var questionHTML = this._template(question);
    
    this._activeQuestion = question.id;
    this._qBlock.innerHTML = questionHTML;
    this._qBlock.style.display = 'block';
    this._video.pause();
    return this.setQuestionsEvents();
  };
  
  Player.prototype.setQuestionsEvents = function () {
    
    for (var i = 0; i < 4; i++) {
      document.getElementById('answer-' + i).addEventListener('click', this.handleAnswerSelection.bind(this));
    }
    return this;
  };
  
  Player.prototype.removeQuestionsEvents = function () {
    
    for (var i = 0; i < 4; i++) {
      document.getElementById('answer-' + i).removeEventListener('click', this.handleAnswerSelection.bind(this));
    }
    return this;
  };
  
  Player.prototype.handleAnswerSelection = function (event) {
    var element = event.target;
    var answer = element.getAttribute('rel');
    var _this = this;
    
    this._answers[String(this._activeQuestion)] = answer;
    
    element.classList.add('selected');
    
    setTimeout(function() {
      _this.hideQuestions();
    }, 2000);
  };
  
  Player.prototype.hideQuestions = function () {
    this.removeQuestionsEvents();
    this._qBlock.style.display = 'none';
    this._qBlock.innerHTML = '';
    
    this._video.play();
    
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
    answerObject.finished = true;
    answerObject.isCorrect = String(this._answers[String(answer.id)]) === String(answerObject.correctAnswer);
    
    if (answerObject.isCorrect) {
      this._score += 1;
    }
    
    answerObject.score = this._score;
    
    this._video.pause();
    
    var answerHTML = this._template(answerObject);
    this._aBlock.innerHTML = answerHTML;
    this._aBlock.style.display = 'block';
    
    setTimeout(function () {
      _this.hideAnswer().printQbar();
    }, 5000)
    
    return this;
  };
  
  window.Player = new Player();
  
})(window/*, jQuery*/);

