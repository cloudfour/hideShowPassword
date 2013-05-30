(function ($, undef) {

  // TODO:
  // - Cleanup
  // - Comment code

  // outer dimension addition for Zepto
  // https://gist.github.com/pamelafox/1379704
  $.each(['width', 'height'], function (index, dimension) {
    var Dimension = dimension.replace(/./, function(m) { return m[0].toUpperCase() })
      , fnName = 'outer' + Dimension
      , sides = {'width': ['left', 'right'], 'height': ['top', 'bottom']};
    if ($.fn[fnName] === undef) {
      $.fn[fnName] = function (margin) {
        var elem = this;
        if (elem) {
          var size = elem[dimension]();
          $.each(sides[dimension], function (index, side) {
            if (margin) size+= parseInt(elem.css('margin-' + side), 10);
          });
          return size;
        }
        return;
      }
    }
  });

  $.fn.hideShowPassword = function (options) {
    var dataKey = 'hideShowPasswordOptions';
    if (typeof options === 'boolean') {
      options = { show: options };
    }
    return this.each(function () {
      var $this = $(this)
        , lastOpts = $this.data(dataKey)
        , opts = $.extend(true, {}, $.fn.hideShowPassword.defaults, lastOpts, options)
        , state = opts.show ? opts.state.shown : opts.state.hidden
        , direction
        , $wrapper
        , $toggle;
      $this.data(dataKey, opts);
      $this.attr(state.attr);
      if (!lastOpts) {
        $this.on(opts.state.shown.eventName, function () {
          $this.addClass(opts.state.shown.inputClass);
          $this.removeClass(opts.state.hidden.inputClass);
        });
        $this.on(opts.state.hidden.eventName, function () {
          $this.addClass(opts.state.hidden.inputClass);
          $this.removeClass(opts.state.shown.inputClass);
        });
      }
      if (opts.innerToggle && (!lastOpts || !lastOpts.innerToggle)) {
        direction = $this.css('direction');
        $this.wrap(
          $('<div />').addClass(opts.wrapperClass).css({
            position: 'relative',
            display: $this.css('display'),
            verticalAlign: $this.css('verticalAlign'),
            marginTop: $this.css('marginTop'),
            marginRight: $this.css('marginRight'),
            marginBottom: $this.css('marginBottom'),
            marginLeft: $this.css('marginLeft')
          })
        );
        $wrapper = $this.parent();
        if ($wrapper.outerWidth() !== $this.outerWidth()) {
          $wrapper.css('width', $this.outerWidth());
        }
        $toggle = $('<div />').addClass(opts.toggleClass).text(state.toggleText).css({
          position: 'absolute',
          top: '50%',
          mozUserSelect: 'none',
          webkitUserSelect: 'none',
          msUserSelect: 'none',
          userSelect: 'none'
        });
        $toggle.css(direction === 'rtl' ? 'left' : 'right', 0);
        $toggle.appendTo($wrapper);
        $toggle.css('marginTop', ($toggle.outerHeight() / -2));
        $this.css({
          marginTop: 0,
          marginRight: 0,
          marginBottom: 0,
          marginLeft: 0
        });
        $this.css(direction === 'rtl' ? 'paddingLeft' : 'paddingRight', $toggle.outerWidth());
        if (opts.touchSupport) {
          $toggle.css('pointerEvents', 'none');
          $this.on(opts.toggleTouchEvent, function (event) {
            var minX = $toggle.offset().left
              , curX = event.pageX || event.originalEvent.pageX;
            if (minX && curX >= minX) {
              event.preventDefault();
              $this.togglePassword();
            }
          });
        } else {
          $toggle.on(opts.toggleEvent, function () {
            $this.togglePassword();
          });
        }
        $this.on(opts.state.shown.eventName, function () {
          $toggle.text(opts.state.shown.toggleText);
          $toggle.addClass(opts.state.shown.toggleClass);
          $toggle.removeClass(opts.state.hidden.toggleClass);
        });
        $this.on(opts.state.hidden.eventName, function () {
          $toggle.text(opts.state.hidden.toggleText);
          $toggle.addClass(opts.state.hidden.toggleClass);
          $toggle.removeClass(opts.state.shown.toggleClass);
        });
        if (opts.hideToggleUntil) {
          $toggle.hide();
          $this.one(opts.hideToggleUntil, function () {
            $toggle.show();
          });
        }
      }
      $this.trigger(state.eventName);
    });
  };

  $.fn.showPassword = function (options) {
    var opts = $.extend({}, options, { show: true });
    return this.hideShowPassword(opts);
  };

  $.fn.hidePassword = function (options) {
    var opts = $.extend({}, options, { show: false });
    return this.hideShowPassword(opts);
  };

  $.fn.isPasswordHidden = function () {
    return ($(this).attr('type') === 'password');
  };

  $.fn.isPasswordShown = function () {
    return !($(this).isPasswordHidden());
  };

  $.fn.togglePassword = function (options) {
    return this.each(function () {
      var $this = $(this)
        , opts = $.extend({}, options, { show: $this.isPasswordHidden() });
      $this.hideShowPassword(opts);
    });
  };

  $.fn.hideShowPassword.defaults = {
    show: false,
    touchSupport: false,
    innerToggle: false,
    hideToggleUntil: 'focus',
    wrapperClass: 'hideShowPassword-wrapper',
    toggleClass: 'hideShowPassword-toggle',
    toggleEvent: 'click',
    toggleTouchEvent: 'touchstart mousedown',
    state: {
      shown: {
        toggleText: 'Hide',
        eventName: 'passwordShown',
        inputClass: 'hideShowPassword-shown',
        toggleClass: 'hideShowPassword-toggle-hide',
        attr: {
          'type': 'text',
          'autocapitalize': 'off',
          'autocomplete': 'off',
          'autocorrect': 'off',
          'spellcheck': 'false'
        }
      },
      hidden: {
        toggleText: 'Show',
        eventName: 'passwordHidden',
        inputClass: 'hideShowPassword-hidden',
        toggleClass: 'hideShowPassword-toggle-show',
        attr: { 'type': 'password' }
      }
    }
  };

})(window.jQuery || window.Zepto);