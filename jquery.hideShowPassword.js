(function ($, window, undef) {

  // TODO:
  // - modularize attr, class, text and events more clearly
  // - only add styles we need to
  // - allow mode where no styles are added? (suppressInnerToggleCSS)?

  var dataKey = 'hideShowPasswordOptions';

  $.fn.hideShowPassword = function (options) {
    if (typeof options === 'boolean') options = { show: options };
    return this.each(function () {
      var $this = $(this)
        , lastOpts = $this.data(dataKey)
        , opts = $.extend(true, {}, $.fn.hideShowPassword.defaults, lastOpts, options)
        , state = opts.show ? opts.state.shown : opts.state.hidden
        , $wrapper
        , $toggle;
      $this.data(dataKey, opts);
      $this.attr(state.attr);
      $this.trigger(state.eventName);
      if (opts.innerToggle && (!lastOpts || !lastOpts.innerToggle)) {
        $this.wrap($('<div />').addClass(opts.wrapperClass));
        $wrapper = $this.parent();
        $toggle = $('<div />').addClass(opts.toggleClass).text(state.toggleText);
        $toggle.appendTo($wrapper);
        $toggle.css('margin-top', ($toggle.outerHeight() / -2));
        if (opts.touchSupport) {
          $toggle.css('pointer-events', 'none');
          $this.on(opts.toggleTouchEvent, function (event) {
            var minX = $toggle.offset().left
              , curX = event.pageX || event.originalEvent.pageX;
            if (curX >= minX) {
              event.preventDefault();
              $this.togglePassword();
            }
          });
        } else {
          $toggle.on(opts.toggleEvent, function () {
            $this.togglePassword();
          });
        }
        $.each(opts.state, function (index, thisState) {
          $this.on(thisState.eventName, function () {
            $toggle.text(thisState.toggleText);
          });
        });
      }
    });
  }

  $.fn.showPassword = function (options) {
    var opts = $.extend({}, options, { show: true });
    return this.hideShowPassword(opts);
  }

  $.fn.hidePassword = function (options) {
    var opts = $.extend({}, options, { show: false });
    return this.hideShowPassword(opts);
  }

  $.fn.togglePassword = function (options) {
    return this.each(function () {
      var $this = $(this)
        , opts = $.extend({}, options, { show: ($this.attr('type') === 'password') });
      $this.hideShowPassword(opts);
    });
  }

  $.fn.hideShowPassword.defaults = {
    show: false,
    touchSupport: false,
    innerToggle: false,
    wrapperClass: 'hideShowPassword-wrapper',
    toggleClass: 'hideShowPassword-toggle',
    toggleEvent: 'click',
    toggleTouchEvent: 'touchstart mousedown',
    state: {
      shown: {
        toggleText: 'Hide',
        eventName: 'passwordShown',
        attr: {
          'type': 'text',
          'autocorrect': 'off',
          'autocapitalize': 'off'
        }
      },
      hidden: {
        toggleText: 'Show',
        eventName: 'passwordHidden',
        attr: { 'type': 'password' }
      }
    }
  };

})(jQuery, window);