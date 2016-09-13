var SCORE_KEY = 'quiz';
var Score = {

  install: function() {
    Score.setScore(1, 'Phil', [{
      name: 'Q1',
      score: 1
    },{
      name: 'Q2',
      score: 0
    },{
      name: 'Q3',
      score: 1
    },{
      name: 'Q4',
      score: 1
    }])
  },

  clear: function() {
    localStorage.removeItem(SCORE_KEY);
    Score.install();
  },

  getAnswersByUser: function(id, name) {
    var scoreList = Score.getScores();
    var answers = [];
    scoreList.forEach(function(score) {
      if (score.id === id && score.name === name) {
        answers = score.answers;
      }
    });
    return answers;
  },

  setScore: function(id, name, answers) {
    var scoreList = localStorage.getItem(SCORE_KEY);
    if (scoreList) {
      scoreList = JSON.parse(scoreList);
    } else {
      scoreList = [];
    }

    var found = false;
    for (var i = 0; i < scoreList.length; i++) {
      var curScore = scoreList[i];
      if (curScore.id === id && curScore.name === name) {
        found = true;
        curScore.score = score;
        curScore.answers = answers;
      }
    }

    var score = 0;

    for (var e = 0; e < answers.length; e++) {
        score += answers[e].score;
    }

    if (!found) {
      scoreList.push({
        id: id,
        name: name,
        score: score,
        answers: answers,
      });
    }

    localStorage.setItem(SCORE_KEY, JSON.stringify(scoreList));
  },

  getScores: function() {
    var scoreList = localStorage.getItem(SCORE_KEY);
    if (scoreList) {
      scoreList = JSON.parse(scoreList);
    } else {
      scoreList = [];
    }
    return scoreList;
  }
/*  getScore: function(id) {
    var local = localStorage.getItem(id);
    if (local) {
      return JSON.parse(local)
    }
    return {
      id: id,
      score: 0,
      answers: []
    }
  }*/
}