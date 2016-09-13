var SCORE_KEY = 'quiz';
var Score = {

  install: function() {
    Score.setScore('Phil', [{
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

  setScore: function(id, name, answers) {

    localStorage.removeItem(SCORE_KEY);

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
      score += answers[i].score;
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