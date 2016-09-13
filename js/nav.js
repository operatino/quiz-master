window.Nav = {
  buttons : [],
  getTargetIndex: function (dir) {
    var currentIndex = Nav._currentActiveIndex;
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
        return targetIndex;
      } else {
        return currentIndex;
      }
    } else {
      console.warn('unknown dir', dir);
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

  init: function (selector, limit) {
    this.itemsInRow = limit;
    document.body.addEventListener('keydown', function (e) {

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
    });

    var buttons = document.querySelectorAll(selector);
    var arr = this.buttons;
    Array.prototype.forEach.call(buttons, function (b) {
      arr.push(b);
    });

    // put the first one, active
    this._activate(0);
  },

  _deactivate: function (node) {
    node.classList.remove('active');
  },

  _activate: function (id) {
    if (Nav._currentActiveNode) {
      this._deactivate(Nav._currentActiveNode);
    }
    Nav._currentActiveIndex = id;
    Nav._currentActiveNode = this.buttons[id];
    Nav._currentActiveNode.classList.add('active');
    Nav._currentActiveNode.focus();
  },

  openGameCenter: function () {
    console.log('openGameCenter');

    console.log('openGame');
    try {
      Nav._openIFrame('./app/index.html');
    } catch (e) {
      console.error(e);
    }
  },

  openGame: function () {
    console.log('openGame');
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
