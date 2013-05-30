(function ($, undef) {

  var dataKey = 'plugin_hideShowPassword'
    , defaults = {
        show: false,
        touchSupport: false,
        innerToggle: false,
        hideToggleUntil: 'focus',
        wrapperClass: 'hideShowPassword-wrapper',
        toggleClass: 'hideShowPassword-toggle',
        toggleEvent: 'click',
        toggleTouchEvent: 'touchstart mousedown',
        states: {
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

  function HideShowPassword(element, options) {
    this.element = $(element);
    this.options = this.prepOptions(options, defaults, (this.element.attr('type') === 'password'));
    this.init();
  }

  HideShowPassword.prototype = {

    init: function () {
      this.updateState(this.element, this.currentStateKey(), this.options.states);
      if (this.options.innerToggle) {
        this.initInnerToggle(this.element, this.options);
      }
    },

    prepOptions: function (options, base, toggleFallback) {
      if (typeof options !== 'object') {
        options = { show: options };
      }
      if (options.show === 'toggle') {
        options.show = toggleFallback;
      }
      return $.extend({}, base, options);
    },

    update: function (options) {
      this.options = this.prepOptions(options, this.options, !this.options.show);
      this.updateState(this.element, this.currentStateKey(), this.options.states);
    },

    updateState: function (el, currentKey, states) {
      $.each(states, function (thisKey, state) {
        if (currentKey === thisKey) {
          el.attr(state.attr).addClass(state.inputClass).trigger(state.eventName);
        } else {
          el.removeClass(state.inputClass);
        }
      });
    },

    toggle: function () {
      this.update('toggle');
    },

    capitalize: function (str) {
      return str.replace(/./, function(m) { return m[0].toUpperCase() });
    },

    currentStateKey: function () {
      return this.options.show ? 'shown' : 'hidden';
    },

    initInnerToggle: function (el, options) {

      // outer dimension addition for Zepto
      // https://gist.github.com/pamelafox/1379704
      $.each(['width', 'height'], $.proxy(function (index, dimension) {
        var Dimension = this.capitalize(dimension)
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
      }, this));

      var attachment = (el.css('direction') === 'rtl') ? 'left' : 'right'
        , elWidth = el.outerWidth()
        , wrapperCSS = {
            position: 'relative',
            display: el.css('display'),
            verticalAlign: el.css('verticalAlign'),
            marginTop: el.css('marginTop'),
            marginRight: el.css('marginRight'),
            marginBottom: el.css('marginBottom'),
            marginLeft: el.css('marginLeft')
          }
        , toggleCSS = {
            position: 'absolute',
            top: '50%',
            mozUserSelect: 'none',
            webkitUserSelect: 'none',
            msUserSelect: 'none',
            userSelect: 'none'
          }
        , elCSS = {
            marginTop: 0,
            marginRight: 0,
            marginBottom: 0,
            marginLeft: 0
          }
        , eventName = ''
        , wrapper
        , toggle;

      el.wrap($('<div />').addClass(options.wrapperClass).css(wrapperCSS));
      wrapper = el.parent();
      if (wrapper.outerWidth() !== elWidth) {
        wrapper.css('width', elWidth);
      }

      toggle = $('<div />').addClass(options.toggleClass);
      this.updateInnerToggle(toggle, this.currentStateKey(), options.states);
      toggleCSS[attachment] = 0;
      toggle.css(toggleCSS);
      toggle.appendTo(wrapper);
      toggle.css('marginTop', (toggle.outerHeight() / -2));

      elCSS['padding' + this.capitalize(attachment)] = toggle.outerWidth();
      el.css(elCSS);

      if (options.touchSupport) {
        toggle.css('pointerEvents', 'none');
        el.on(options.toggleTouchEvent, $.proxy(function (event) {
          var toggleX = toggle.offset().left
            , eventX
            , lesser
            , greater;
          if (toggleX) {
            eventX = event.pageX || event.originalEvent.pageX;
            if (attachment === 'left') {
              toggleX+= toggle.outerWidth();
              lesser = eventX;
              greater = toggleX;
            } else {
              lesser = toggleX;
              greater = eventX;
            }
            if (greater >= lesser) {
              event.preventDefault();
              this.toggle();
            }
          }
        }, this));
      } else {
        toggle.on(options.toggleEvent, $.proxy(function () {
          this.toggle();
        }, this));
      }

      $.each(options.states, function (key, state) {
        eventName += state.eventName + ' ';
      });
      el.on(eventName, $.proxy(function () {
        this.updateInnerToggle(toggle, this.currentStateKey(), options.states);
      }, this));


      if (options.hideToggleUntil) {
        toggle.hide();
        el.one(options.hideToggleUntil, function () {
          toggle.show();
        });
      }

    },

    updateInnerToggle: function (el, currentKey, states) {
      $.each(states, function (thisKey, state) {
        if (currentKey === thisKey) {
          el.addClass(state.toggleClass).text(state.toggleText);
        } else {
          el.removeClass(state.toggleClass);
        }
      });
    }

  };

  $.fn.hideShowPassword = function (options) {
    return this.each(function () {
      var data = $.data(this, dataKey);
      if (data) {
        data.update(options);
      } else {
        $.data(this, dataKey, new HideShowPassword(this, options));
      }
    });
  };

  $.fn.showPassword = function (options) {
    return this.hideShowPassword($.extend({}, options, { show: true }));
  };

  $.fn.hidePassword = function (options) {
    return this.hideShowPassword($.extend({}, options, { show: false }));
  };

  $.fn.togglePassword = function (options) {
    return this.hideShowPassword($.extend({}, options, { show: 'toggle' }));
  };

})(window.jQuery || window.Zepto);