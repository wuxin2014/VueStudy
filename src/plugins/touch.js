// eslint-disable-next-line no-unused-vars
function vueTouch(el, binding, type, vnode) {
  this.obj = el;
  this.binding = binding;
  this.touchType = type;
  this.vueTouches = { x: 0, y: 0 };
  this.vueMoves = true;
  this.vueLeave = true;
  this.longTouch = true;
  this.vueCallBack = binding.value;
  this.obj.addEventListener(
    'touchstart',
    e => {
      this.start(e);
    },
    false
  );
  this.obj.addEventListener(
    'touchend',
    e => {
      this.end(e);
    },
    false
  );
  this.obj.addEventListener(
    'touchmove',
    e => {
      this.move(e);
    },
    false
  );
  // vnode.key = this.randomString()
}

vueTouch.prototype = {
  start(e) {
    this.vueMoves = true;
    this.vueLeave = true;
    this.longTouch = true;
    this.vueTouches = {
      x: e.changedTouches[0].pageX,
      y: e.changedTouches[0].pageY
    };
    this.time = setTimeout(
      function() {
        if (this.vueLeave && this.vueMoves) {
          // eslint-disable-next-line no-unused-expressions
          this.touchType === 'longtap' && this.vueCallBack();
          this.longTouch = false;
        }
      }.bind(this),
      1000
    );
  },
  end(e) {
    const disX = e.changedTouches[0].pageX - this.vueTouches.x;
    const disY = e.changedTouches[0].pageY - this.vueTouches.y;
    clearTimeout(this.time);
    if (Math.abs(disX) > 10 || Math.abs(disY) > 100) {
      // eslint-disable-next-line no-unused-expressions
      this.touchType === 'swipe' && this.vueCallBack(e);
      if (Math.abs(disX) > Math.abs(disY)) {
        if (disX > 10) {
          // eslint-disable-next-line no-unused-expressions
          this.touchType === 'swiperight' && this.vueCallBack(e);
        }

        if (disX < -10) {
          // eslint-disable-next-line no-unused-expressions
          this.touchType === 'swipeleft' && this.vueCallBack(e);
        }
      } else {
        if (disY > 10) {
          // eslint-disable-next-line no-unused-expressions
          this.touchType === 'swipedown' && this.vueCallBack(e);
        }

        if (disY < -10) {
          // eslint-disable-next-line no-unused-expressions
          this.touchType === 'swipeup' && this.vueCallBack(e);
        }
      }
    } else if (this.longTouch && this.vueMoves) {
      // eslint-disable-next-line no-unused-expressions
      this.touchType === 'tap' && this.vueCallBack(e);
      this.vueLeave = false;
    }
  },
  // eslint-disable-next-line no-unused-vars
  move(e) {
    this.vueMoves = false;
  },
  randomString() {
    const len = 10;
    const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    const maxPos = $chars.length;
    let pwd = '';
    for (let i = 0; i < len; i += 1) {
      pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
  }
};

export default {
  // eslint-disable-next-line no-unused-vars
  install(Vue, options) {
    Vue.directive('tap', {
      bind(el, binding, vnode) {
        // eslint-disable-next-line no-new,new-cap
        new vueTouch(el, binding, 'tap', vnode);
      }
    });
    Vue.directive('swipe', {
      bind(el, binding, vnode) {
        // eslint-disable-next-line no-new,new-cap
        new vueTouch(el, binding, 'swipe', vnode);
      }
    });
    Vue.directive('swipeleft', {
      bind(el, binding, vnode) {
        // eslint-disable-next-line no-new,new-cap
        new vueTouch(el, binding, 'swipeleft', vnode);
      }
    });
    Vue.directive('swiperight', {
      bind(el, binding, vnode) {
        // eslint-disable-next-line no-new,new-cap
        new vueTouch(el, binding, 'swiperight', vnode);
      }
    });
    Vue.directive('swipedown', {
      bind(el, binding, vnode) {
        // eslint-disable-next-line no-new,new-cap
        new vueTouch(el, binding, 'swipedown', vnode);
      }
    });
    Vue.directive('swipeup', {
      bind(el, binding, vnode) {
        // eslint-disable-next-line new-cap,no-new
        new vueTouch(el, binding, 'swipeup', vnode);
      }
    });
    Vue.directive('longtap', {
      bind(el, binding, vnode) {
        // eslint-disable-next-line no-new,new-cap
        new vueTouch(el, binding, 'longtap', vnode);
      }
    });
  }
};
