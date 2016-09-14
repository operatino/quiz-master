window.Nav = {
  buttons : [],
  getTargetIndex: function (dir) {
    var currentIndex = Nav._currentActiveIndex;
    var bodyEl = window.document.body;
    var targetIndex;

    if (dir == 'next') {
      if (this.buttons[currentIndex + 1]) {
        return currentIndex + 1;
      } else {
        return currentIndex;
      }
    } else if (dir == 'prev') {
      targetIndex = currentIndex - 1;
      if (this.buttons[targetIndex]) {
        return targetIndex;
      } else {
        return 0;
      }
    } else if (dir == 'down') {
      targetIndex = currentIndex + this.itemsInRow;
      if (this.buttons[targetIndex]) {
        return targetIndex;
      } else {
        return currentIndex;
      }
    } else if (dir == 'up') {

      targetIndex = currentIndex - this.itemsInRow;
      if (this.buttons[targetIndex]) {
        this.scrollTop(targetIndex);
        return targetIndex;
      } else {
        var newTarget = (currentIndex - this.itemsInRow < 0) ? 0 : currentIndex - this.itemsInRow;
        this.scrollTop(newTarget);
        return newTarget;
      }
    } else {
      console.warn('unknown dir', dir);
    }
  },
  
  scrollTop: function (index) {
    if (index < 8) {
      (document.body || document.documentElement).scrollTop = 0;
    }
  },

  goRight: function () {
    var index = this.getTargetIndex('next');
    this._activate(index);
  },

  goLeft: function () {
    var index = this.getTargetIndex('prev');
    this._activate(index);
  },

  goUp: function() {
    var index = this.getTargetIndex('up');
    this._activate(index);
  },

  goDown: function() {
    var index = this.getTargetIndex('down');
    this._activate(index);
  },

  enter: function () {
    var current = this._currentActiveNode;
    try {
      current.click();
    } catch (e) {
      console.error('wtf');
    }
  },
  

  
  FN: function (e) {

    switch(e.keyCode) {
      case 37: //left
        Nav.goLeft();
        e.preventDefault();
        break;
      case 38: //up
        Nav.goUp();
        e.preventDefault();
        break;
      case 39: //right
        Nav.goRight();
        e.preventDefault();
        break;
      case 40: //down
        Nav.goDown();
        e.preventDefault();
        break;
      case 13: //enter
        Nav.enter();
        break;
    }
  },

  init: function (selector, limit) {
    this.itemsInRow = limit;

    document.body.removeEventListener('keydown', this.FN);
    document.body.addEventListener('keydown', this.FN);
    
    var buttons = document.querySelectorAll(selector);
    this.buttons = [];
    Nav._currentActiveIndex = 0;
    Nav._currentActiveNode = buttons[0];
    var arr = this.buttons;
    Array.prototype.forEach.call(buttons, function (b) {
      b.classList.remove('active');
      arr.push(b);
    });
    this.buttons = arr;
    // put the first one, active
    this._activate(1);
  },

  _deactivate: function (node) {
    node.classList.remove('active');
  },

  _activate: function (id) {
    console.log('ac', id)
    if (Nav._currentActiveNode) {
      this._deactivate(Nav._currentActiveNode);
    }
    Nav._currentActiveIndex = id;
    Nav._currentActiveNode = this.buttons[id];
    Nav._currentActiveNode.classList.add('active');
    Nav._currentActiveNode.focus();
  },

  openGameCenter: function () {
    try {
      Nav._openIFrame('./app/index.html');
    } catch (e) {
      console.error(e);
    }
  },

  openGame: function () {
    try {
      Nav._openIFrame('./2048/index.html');
    } catch (e) {
      console.error(e);
    }
  },

  _openIFrame: function (src) {
    document.location = src;
  }
};
