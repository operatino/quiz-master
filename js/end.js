(function(){
  var movieId = 1;
  var myName = Score.getFakeUserName();

 // Score.setScore(movieId, myName, [{name: 'Q1', score: 1}, {name: 'Q2', score: 0},{name: 'Q3', score: 1}, {name: 'Q4', score: 0},{name: 'Q5', score: 1}, {name: 'Q6', score: 0},{name: 'Q7', score: 1}, {name: 'Q8', score: 0} ])

  var scores = Score.getScores();
  var userAnswers = Score.getAnswersByUser(movieId, myName);
  var $scoresEl = '<h1>Your friends:</h1>';
  var $answerEl = '<h1>Your score: %score%</h1>';
  var yourScore = 0;

  var $el = $('#results');

  scores.sort(function (a, b) {
    return b.score - a.score ;
  });

  scores.forEach(function(score) {
    $scoresEl += '<span class="' + (score.name === myName ? 'is-me' : '') + '">' + score.name + ': ' + score.score + '</span>'
  });

  userAnswers.forEach(function(answer) {
    yourScore += answer.score;
    $answerEl += '<span class="' + (answer.score ? 'correct-answer': 'wrong-answer') + '">' + answer.name + '</span>'
  });

  $answerEl = $answerEl.replace(/%score%/gi, yourScore);

  $el.find('#scores').html($scoresEl);
  $el.find('#answers').html($answerEl);

  $(window).keypress(function (e) {
    if (e.keyCode === 0 || e.keyCode === 32 || e.keyCode === 461 || e.keyCode === 8) {
      e.preventDefault();
      window.location.href = './index.html';
    }
  });

  $("#back-btn").focus();

})();
