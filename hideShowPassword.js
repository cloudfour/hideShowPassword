(function (factory, global) {

  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else {
    // Browser globals.
    factory(global.jQuery);
  }

}(function ($, undef) {

  var dataKey = 'plugin_hideShowPassword'
  var shorthandArgs = ['show', 'innerToggle'];
  var SPACE = 32;
  var ENTER = 13;

  var defaults = {

    show: 'infer',
    innerToggle: false,
    touchSupport: (typeof Modernizr === 'undefined') ? false : Modernizr.touch,
    hideMsReveal: true,
    enable: (function(){
      var body = document.body
        , input = document.createElement('input')
        , result = true;
      if (! body) {
        body = document.createElement('body');
      }
      input = body.appendChild(input);
      try {
        input.setAttribute('type', 'text');
      } catch (e) {
        result = false;
      }
      body.removeChild(input);
      return result;
    }()),

    className: 'hideShowPassword-field',
    eventName: 'passwordVisibilityChange',
    props: {
      autocapitalize: 'off',
      autocomplete: 'off',
      autocorrect: 'off',
      spellcheck: 'false'
    },

    toggle: {
      element: '<button>',
      className: 'hideShowPassword-toggle',
      hideUntil: null,
      attachToEvent: 'click',
      attachToTouchEvent: 'touchstart mousedown',
      attachToKeyCodes: true,
      styles: { position: 'absolute' },
      touchStyles: { pointerEvents: 'none' },
      position: 'infer',
      verticalAlign: 'middle',
      attr: {
        role: 'button',
        'aria-label': 'Show Password',
        tabIndex: 0
      }
    },

    wrapper: {
      element: '<div>',
      className: 'hideShowPassword-wrapper',
      enforceWidth: true,
      styles: { position: 'relative' },
      inheritStyles: [
        'display',
        'verticalAlign',
        'marginTop',
        'marginRight',
        'marginBottom',
        'marginLeft'
      ],
      innerElementStyles: {
        marginTop: 0,
        marginRight: 0,
        marginBottom: 0,
        marginLeft: 0
      }
    },

    states: {
      shown: {
        className: 'hideShowPassword-shown',
        eventName: 'passwordShown',
        props: { type: 'text' },
        toggle: {
          className: 'hideShowPassword-toggle-hide',
          content: 'Hide',
          attr: { 'aria-pressed': 'true' }
        }
      },
      hidden: {
        className: 'hideShowPassword-hidden',
        eventName: 'passwordHidden',
        props: { type: 'password' },
        toggle: {
          className: 'hideShowPassword-toggle-show',
          content: 'Show',
          attr: { 'aria-pressed': 'false' }
        }
      }
    }

  };

  function HideShowPassword (element, options) {
    this.element = $(element);
    this.wrapperElement = $();
    this.toggleElement = $();
    this.init(options);
  }

  HideShowPassword.prototype = {

    init: function (options) {
      this.update(options, defaults);
      if (this.options.enable) {
        if (this.options.hideMsReveal) {
          $('<style> ' + this.options.className + '::-ms-reveal { display: none !important; } </style>').appendTo('head');
        }
        if (this.options.innerToggle) {
          this.initWrapper();
          this.initToggle();
        }
      }
    },

    update: function (options, base) {
      base = base || this.options;
      this.options = $.extend(true, {}, base, options);
      if (! this.options.enable) return;
      switch (this.options.show) {
        case 'toggle': this.options.show = this.isType('hidden'); break;
        case 'infer':  this.options.show = this.isType('shown');  break;
      }
      if (this.options.toggle.position === 'infer') {
        this.options.toggle.position = (this.element.css('text-direction') === 'rtl') ? 'left' : 'right';
      }
      if (! this.isType()) {
        this.element
          .prop($.extend({}, this.options.props, this.state().props))
          .addClass(this.options.className + ' ' + this.state().className)
          .removeClass(this.otherState().className);
        this.updateToggle();
        this.element
          .trigger(this.options.eventName)
          .trigger(this.state().eventName);
      }
    },

    isType: function (comparison) {
      comparison = comparison || this.state().props.type;
      if (this.options.states[comparison]) {
        comparison = this.options.states[comparison].props.type;
      }
      return this.element.prop('type') === comparison;
    },

    state: function (key, invert) {
      if (key === undef) {
        key = this.options.show;
      }
      if (typeof key === 'boolean') {
        key = key ? 'shown' : 'hidden';
      }
      if (invert) {
        key = (key === 'shown') ? 'hidden' : 'shown';
      }
      return this.options.states[key];
    },

    otherState: function (key) {
      return this.state(key, true);
    },

    initWrapper: function () {
      var wrapperStyles = this.options.wrapper.styles
        , enforceWidth = this.options.wrapper.enforceWidth
        , elementWidth = this.element.outerWidth();

      $.each(this.options.wrapper.inheritStyles, $.proxy(function (index, prop) {
        wrapperStyles[prop] = this.element.css(prop);
      }, this));

      this.element.wrap(
        $(this.options.wrapper.element)
          .addClass(this.options.wrapper.className)
          .css(wrapperStyles)
      );
      this.wrapperElement = this.element.parent();

      this.element.css(this.options.wrapper.innerElementStyles);

      if (enforceWidth === true) {
        enforceWidth = (this.wrapperElement.outerWidth() === elementWidth) ? false : elementWidth;
      }
      if (enforceWidth !== false) {
        this.wrapperElement.css('width', enforceWidth);
      }
    },

    initToggle: function () {
      this.toggleElement = $(this.options.toggle.element)
        .attr(this.options.toggle.attr)
        .addClass(this.options.toggle.className)
        .css(this.options.toggle.styles)
        .appendTo(this.wrapperElement);
      this.updateToggle();

      this.toggleElement.css(this.options.toggle.position, 0);
      this.element.css('padding-' + this.options.toggle.position, this.toggleElement.outerWidth());

      switch (this.options.toggle.verticalAlign) {
        case 'top':
        case 'bottom':
          this.toggleElement.css(this.options.toggle.verticalAlign, 0);
          break;
        case 'middle':
          this.toggleElement.css({
            top: '50%',
            marginTop: (this.toggleElement.outerHeight() / -2)
          });
          break;
        case 'stretch':
          this.toggleElement.css({
            top: 0,
            bottom: 0
          });
          break;
      }

      if (this.options.touchSupport) {
        this.toggleElement.css(this.options.toggle.touchStyles);
        this.element.on(this.options.toggle.attachToTouchEvent, $.proxy(function (event) {
          var toggleX = this.toggleElement.offset().left
            , eventX
            , lesser
            , greater;
          if (toggleX) {
            eventX = event.pageX || event.originalEvent.pageX;
            if (this.options.toggle.position === 'left') {
              toggleX+= this.toggleElement.outerWidth();
              lesser = eventX;
              greater = toggleX;
            } else {
              lesser = toggleX;
              greater = eventX;
            }
            if (greater >= lesser) {
              event.preventDefault();
              this.update({ show: 'toggle' });
            }
          }
        }, this));
      } else {
        this.toggleElement.on(this.options.toggle.attachToEvent, $.proxy(function (event) {
          event.preventDefault();
          this.update({ show: 'toggle' });
        }, this));
      }

      if (this.options.toggle.attachToKeyCodes) {
        var keyCodes = this.options.toggle.attachToKeyCodes;
        if (keyCodes === true) {
          keyCodes = [];
          switch (this.toggleElement.prop('tagName').toLowerCase()) {
            case 'button':
            case 'input':
              break;
            case 'a':
              if (this.toggleElement.filter('[href]').length) {
                keyCodes.push(SPACE);
                break;
              }
            default:
              keyCodes.push(SPACE, ENTER); break;
          }
        }
        if (keyCodes.length) {
          this.toggleElement.on('keyup', $.proxy(function (event) {
            for (var i = 0; i < keyCodes.length; i++) {
              if (event.which === keyCodes[i]) {
                event.preventDefault();
                this.update({ show: 'toggle' });
                break;
              }
            }
          }, this))
        }
      }

    },

    updateToggle: function () {
      this.toggleElement
        .attr(this.state().toggle.attr)
        .addClass(this.state().toggle.className)
        .removeClass(this.otherState().toggle.className)
        .html(this.state().toggle.content);
    }

  };

  $.fn.hideShowPassword = function () {
    var options = {};
    $.each(arguments, function (index, value) {
      var newOptions = {};
      if (typeof value === 'object') {
        newOptions = value;
      } else if (shorthandArgs[index]) {
        newOptions[shorthandArgs[index]] = value;
      } else {
        return false;
      }
      $.extend(true, options, newOptions);
    });
    return this.each(function(){
      var $this = $(this)
        , data = $this.data(dataKey);
      if (data) {
        data.update(options);
      } else {
        $this.data(dataKey, new HideShowPassword(this, options));
      }
    });
  };

  $.each({ 'show':true, 'hide':false, 'toggle':'toggle' }, function (verb, showVal) {
    $.fn[verb + 'Password'] = function (innerToggle, options) {
      return this.hideShowPassword(showVal, innerToggle, options);
    };
  });

}, this));