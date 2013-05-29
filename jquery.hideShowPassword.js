(function ($, window, undef) {

  $.fn.hideShowPassword = function (options) {
    var opts = $.extend({}, $.fn.hideShowPassword.defaults, options);
    return this.each(function () {
      var $this = $(this)
        , $wrapper
        , $toggle;
      if (opts.innerToggle) {
        $this.wrap($('<div />').addClass(opts.wrapperClass));
        $wrapper = $this.parent();
        $toggle = $('<div />').addClass(opts.innerToggleClass).text(
          opts.show ? opts.hideText : opts.showText
        );
        $toggle.appendTo($wrapper);
        $toggle.css({
          'margin-top': ($toggle.outerHeight() / -2)
        });
        $this.css({
          'padding-right': $toggle.outerWidth()
        });

        if (opts.touchSupport) {
          $toggle.css('pointer-events', 'none');
          $this.on('touchstart', function (event) {
            var minLeft = $toggle.offset().left
              , pageX = (event.pageX === undef) ? event.originalEvent.pageX : event.pageX;
            if (pageX >= minLeft) {
              event.preventDefault();
              if ($this.attr('type') === 'password') {
                $this.attr(opts.textArgs);
                $toggle.text(opts.hideText);
              } else {
                $this.attr(opts.passwordArgs);
                $toggle.text(opts.showText);
              }
            }
          });
        } else {
          $toggle.on('click', function (event) {
            if ($this.attr('type') === 'password') {
              $this.attr(opts.textArgs);
              $toggle.text(opts.hideText);
            } else {
              $this.attr(opts.passwordArgs);
              $toggle.text(opts.showText);
            }
          });
        }
      }
    });
  };

  $.fn.hideShowPassword.defaults = {
    innerToggle: false,
    innerToggleClass: 'hideShowPassword-toggle',
    wrapperClass: 'hideShowPassword-wrapper',
    showText: 'Show',
    hideText: 'Hide',
    touchSupport: false,
    show: false,
    textArgs: {
      'type': 'text',
      'autocorrect': 'off',
      'autocapitalize': 'off'
    },
    passwordArgs: {
      'type': 'password'
    }
  };

})(jQuery, window);