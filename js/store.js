var SCORE_KEY = 'quiz';
var Score = {

  getFakeUserName: function() {
    return 'You'
  },

  install: function() {
    Score.clear();
    Score.setScore(1, 'Phil B', [{
      name: 'Q1',
      score: 1
    },{
      name: 'Q2',
      score: 0
    },{
      name: 'Q3',
      score: 1
    }]);
    Score.setScore(1, 'Daniel S', [{
      name: 'Q1',
      score: 0
    },{
      name: 'Q2',
      score: 1
    },{
      name: 'Q3',
      score: 1
    }]);
    Score.setScore(1, 'Elvin F', [{
      name: 'Q1',
      score: 1
    },{
      name: 'Q2',
      score: 1
    },{
      name: 'Q3',
      score: 1
    }]);
    Score.setScore(1, 'Ramon G', [{
      name: 'Q1',
      score: 0
    },{
      name: 'Q2',
      score: 0
    },{
      name: 'Q3',
      score: 0
    }]);
    Score.setScore(1, 'Laura B', [{
      name: 'Q1',
      score: 1
    },{
      name: 'Q2',
      score: 1
    },{
      name: 'Q3',
      score: 1
    }]);
    Score.setScore(1, 'Marlies K', [{
      name: 'Q1',
      score: 0
    },{
      name: 'Q2',
      score: 0
    },{
      name: 'Q3',
      score: 1
    }]);
  },

  clear: function() {
    localStorage.removeItem(SCORE_KEY);
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