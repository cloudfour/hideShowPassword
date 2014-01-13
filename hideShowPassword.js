/* https://github.com/cloudfour/hideShowPassword */
(function (factory, global) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    // To use Zepto, map Zepto to the the name 'jquery' in your paths config
    define(['jquery'], factory);
  } else {
    // Browser globals
    factory(global.jQuery || global.Zepto);
  }
}(function ($, undef) {

  var dataKey = 'plugin_hideShowPassword' // Where to store instances
    , defaults = {
        // Visibility of the password text. Can be true, false, 'toggle'
        // or 'infer'. If 'toggle', it will be the opposite of whatever
        // it currently is. If 'infer', it will be based on the input
        // type (false if 'password', otherwise true).
        show: 'infer',

        // Set to true to create an inner toggle for this input.
        innerToggle: false,

        // Specify an event for the input that should make the innerToggle
        // visible. If false, the toggle will be immediately visible.
        // Example: 'focus'
        hideToggleUntil: false,

        // By default, the innerToggle will work like any old clickable
        // element. If this is set to true, it will use touch-optimized
        // events so you can tap it on a touch device without losing
        // your input focus.
        touchSupport: false,

        // Event to use for inner toggle when touchSupport is false.
        toggleEvent: 'click',

        // ...and when touchSupport is true.
        toggleTouchEvent: 'touchstart mousedown',

        // When innerToggle is true, the input needs to be wrapped in
        // a containing element. You can specify the class name of this
        // element here. Useful for custom styles.
        wrapperClass: 'hideShowPassword-wrapper',

        // If innerToggle is true, this will set the wrapper's width.
        // If true, it will be set to the input element's computed width
        // only if that width differs from its own.
        // If any other non-false or non-null value, the width will be
        // set to the value.
        // If false, the width will never be set.
        wrapperWidth: true,

        // Class name for the inner toggle.
        toggleClass: 'hideShowPassword-toggle',

        // The states object includes settings specific to the "shown"
        // or "hidden" states of the input field.
        states: {

          // These settings are applied when the password text is
          // visible (show: true).
          shown: {

            // Class to apply to the input element.
            inputClass: 'hideShowPassword-shown',

            // Event to trigger on the input.
            eventName: 'passwordShown',

            // Class to apply to the toggle.
            toggleClass: 'hideShowPassword-toggle-hide',

            // Text of the toggle element.
            toggleText: 'Hide',

            // Property values to apply to the input element.
            attr: {
              'type': 'text',
              'autocapitalize': 'off',
              'autocomplete': 'off',
              'autocorrect': 'off',
              'spellcheck': 'false'
            }
          },

          // Settings when text is hidden (show: false).
          hidden: {
            inputClass: 'hideShowPassword-hidden',
            eventName: 'passwordHidden',
            toggleClass: 'hideShowPassword-toggle-show',
            toggleText: 'Show',
            attr: { 'type': 'password' }
          }
        },

        // When innerToggle is true, some elements are styled based
        // on their width. Unless box-sizing is set to border-box,
        // outerWidth() is a more reliable method than width(), but it is
        // not included with Zepto. If you plan to include your own plugin
        // for determining width, you can specify its key as a string to
        // override these defaults.
        widthMethod: ($.fn.outerWidth === undef) ? 'width' : 'outerWidth',
        heightMethod: ($.fn.outerHeight === undef) ? 'height' : 'outerHeight'
      };

  // Constructor
  function HideShowPassword(element, options) {
    this.element = $(element);
    this.init(options);
  }

  HideShowPassword.prototype = {

    // Initialization logic (only runs first time)
    init: function (options) {
      this.update(options, defaults, (this.element.prop('type') === 'password'));
      if (this.options.innerToggle) {
        this.initInnerToggle(this.element, this.options);
      }
    },

    // Processes fresh options and updates the input state
    update: function (options, base, toggleFallback) {
      base = base || this.options;
      toggleFallback = toggleFallback || !this.options.show;
      // Allow show/hide shorthand
      if (typeof options !== 'object') {
        options = { show: options };
      }
      // Update the options
      this.options = $.extend(true, {}, base, options);
      // Interpret strings
      if (this.options.show === 'toggle') {
        this.options.show = toggleFallback;
      }
      if (this.options.show === 'infer') {
        this.options.show = (this.element.prop('type') !== 'password');
      }
      // Apply and remove attributes based on the new state
      this.ifCurrentOrNot($.proxy(function (state) {
        // This is a loop because Zepto's prop method does not
        // support an object of key/value pairs.
        $.each(state.attr, $.proxy(function (key, value) {
          this.element.prop(key, value);
        }, this));
        this.element.addClass(state.inputClass).trigger(state.eventName);
      }, this), $.proxy(function (state) {
        this.element.removeClass(state.inputClass);
      }, this));
    },

    // Toggle shorthand
    toggle: function () {
      this.update('toggle');
    },

    // Return the current state key
    currentStateKey: function () {
      return this.options.show ? 'shown' : 'hidden';
    },

    // Loop through all states, perform one action for
    // the current state and another for others.
    ifCurrentOrNot: function (ifCurrent, ifNot) {
      var currentKey = this.currentStateKey();
      $.each(this.options.states, function (thisKey, state) {
        ((currentKey === thisKey) ? ifCurrent : ifNot)(state);
      });
    },

    // Build the inner toggle, wrapper, and associated events
    initInnerToggle: function (el, options) {

      var attachment = (el.css('direction') === 'rtl') ? 'left' : 'right'
        , elWidth = el[options.widthMethod]()
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

      if (options.wrapperWidth === true && wrapper[options.widthMethod]() !== elWidth) {
        wrapper.css('width', elWidth);
      } else if (options.wrapperWidth !== false && options.wrapperWidth !== null) {
        wrapper.css('width', options.wrapperWidth);
      }

      toggle = $('<div />').addClass(options.toggleClass);
      this.updateInnerToggle(toggle, this.currentStateKey(), options.states);
      toggleCSS[attachment] = 0;
      toggle.css(toggleCSS);
      toggle.appendTo(wrapper);
      toggle.css('marginTop', (toggle[options.heightMethod]() / -2));

      elCSS['padding' + attachment.replace(/./, function(m) { return m[0].toUpperCase() })] = toggle[options.widthMethod]();
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
              toggleX+= toggle[options.widthMethod]();
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

    // Update the inner toggle (text, class, etc.)
    updateInnerToggle: function (el, currentKey, states) {
      this.ifCurrentOrNot(function (state) {
        el.addClass(state.toggleClass).text(state.toggleText);
      }, function (state) {
        el.removeClass(state.toggleClass);
      });
    }

  };

  // The main function, reuses previous instance if it exists
  $.fn.hideShowPassword = function (options) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data(dataKey);
      if (data) {
        data.update(options);
      } else {
        $this.data(dataKey, new HideShowPassword(this, options));
      }
    });
  };

  // Shorthand plugins
  $.each({ 'show':true, 'hide':false, 'toggle':'toggle' }, function (verb, showVal) {
    $.fn[verb + 'Password'] = function (options) {
      return this.hideShowPassword($.extend({}, options, { show: showVal }));
    };
  });

}, this));