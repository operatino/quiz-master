function Create() {
  var _this = this;
  this.$el = null;
  //this.currentVideoTime = 0;
  this.$videoEl = null;

  this.init = function($el, url) {
    this.$el = $el;
    this.$videoEl = this.$el.find('#player');
    this.$form = this.$el.find('#add-question-form');
    this.$questions = this.$el.find('#questions');

    console.log(this.$el.find('#add-question'));

    this.$el.find('#add-question').click(function() {
      console.log('Addd question');
      _this.$form.show();
    });

    console.log(this.$videoEl);
  }

  this.addQuestion = function(obj) {
    _this.$questions.append('<li>' + obj.question + ' <span>edit</span><span>remove</span></li>')
    console.log('Blaaaa');
  };

  this.startVideo = function() {

  }

  this.startVideo = function() {

  }

  return this;
};

