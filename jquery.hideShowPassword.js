(function ($, window, undef) {

  // TODO:
  // - only add styles we need to
  // - allow mode where no styles are added? (suppressInnerToggleCSS)?

  var dataKey = 'hideShowPasswordOptions';

  $.fn.hideShowPassword = function (options) {
    if (typeof options === 'boolean') options = { show: options };
    return this.each(function () {
      var $this = $(this)
        , lastOpts = $this.data(dataKey)
        , opts = $.extend({}, $.fn.hideShowPassword.defaults, lastOpts, options)
        , attr = opts.show ? opts.showAttr : opts.hideAttr
        , $wrapper
        , $toggle;
      $this.data(dataKey, opts);
      $this.attr(attr);
      $this.trigger(opts.show ? opts.showEvent : opts.hideEvent);
      if (opts.innerToggle && (!lastOpts || !lastOpts.innerToggle)) {
        $this.wrap($('<div />').addClass(opts.wrapperClass));
        $wrapper = $this.parent();
        $toggle = $('<div />').addClass(opts.toggleClass).text(
          opts.show ? opts.hideText : opts.showText
        );
        $toggle.appendTo($wrapper);
        $toggle.css('margin-top', ($toggle.outerHeight() / -2));
        if (opts.touchSupport) {
          $toggle.css('pointer-events', 'none');
          $this.on('touchstart', function (event) {
            var minX = $toggle.offset().left
              , curX = event.pageX || event.originalEvent.pageX;
            if (curX >= minX) {
              event.preventDefault();
              $this.togglePassword();
            }
          });
        } else {
          $toggle.on('click', function () {
            $this.togglePassword();
          });
        }
        $this.on(opts.showEvent, function () {
          $toggle.text(opts.hideText);
        });
        $this.on(opts.hideEvent, function () {
          $toggle.text(opts.showText);
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
    showText: 'show',
    hideText: 'hide',
    showAttr: {
      'type': 'text',
      'autocorrect': 'off',
      'autocapitalize': 'off'
    },
    hideAttr: {
      'type': 'password'
    },
    showEvent: 'passwordShown',
    hideEvent: 'passwordHidden'
  };

})(jQuery, window);