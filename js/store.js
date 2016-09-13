var Score = {
   setScore: function(id, score, answers) {
     var score = {
       id: id,
       score: score,
       answers: answers,
     }
     localStorage.setItem(id, JSON.stringify(score));
   },
   getScore: function(id) {
     var local = localStorage.getItem(id);
     if (local) {
       return JSON.parse(local)
     }
      return {
        id: id,
        score: 0,
        answers: []
      }
   }
}