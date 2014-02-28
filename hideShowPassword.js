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
    , shorthandArgs = ['show', 'innerToggle']
    , SPACE = 32
    , ENTER = 13;

  var canSetInputAttribute = (function(){
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
  }());

  var defaults = {

    show: 'infer',
    innerToggle: false,
    hideMsReveal: true,
    enable: canSetInputAttribute,

    className: 'hideShowPassword-field',
    initEvent: 'hideShowPasswordInit',
    changeEvent: 'passwordVisibilityChange',
    props: {
      autocapitalize: 'off',
      autocomplete: 'off',
      autocorrect: 'off',
      spellcheck: 'false'
    },

    toggle: {
      element: '<button type="button">',
      className: 'hideShowPassword-toggle',
      touchSupport: (typeof Modernizr === 'undefined') ? false : Modernizr.touch,
      attachToEvent: 'click',
      attachToTouchEvent: 'touchstart mousedown',
      attachToKeyCodes: true,
      styles: { position: 'absolute' },
      touchStyles: { pointerEvents: 'none' },
      position: 'infer',
      verticalAlign: 'middle',
      offset: 0,
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
        changeEvent: 'passwordShown',
        props: { type: 'text' },
        toggle: {
          className: 'hideShowPassword-toggle-hide',
          content: 'Hide',
          attr: { 'aria-pressed': 'true' }
        }
      },
      hidden: {
        className: 'hideShowPassword-hidden',
        changeEvent: 'passwordHidden',
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
    this.init(options);
  }

  HideShowPassword.prototype = {

    init: function (options) {
      if (this.update(options, defaults)) {
        if (this.options.hideMsReveal) {
          $('<style> ' + (this.options.className || '') + '::-ms-reveal { display: none !important; } </style>').appendTo('head');
        }
        if (this.options.innerToggle) {
          this.toggle.init(
            $.proxy(function (event) {
              event.preventDefault();
              this.update({ show: 'toggle' });
            }, this),
            this.element,
            this.wrapper.init(this.element, this.options.wrapper),
            this.options.toggle,
            this.state().toggle,
            this.otherState().toggle,
            (typeof this.options.innerToggle === 'string') ? this.options.innerToggle : undef
          );
        }
        this.element.trigger(this.options.initEvent, [ this ]);
      }
    },

    update: function (options, base) {
      this.options = this.prepareOptions(options, base);
      if (this.updateElement()) {
        this.toggle.update(this.state().toggle, this.otherState().toggle);
        this.element
          .trigger(this.options.changeEvent, [ this ])
          .trigger(this.state().changeEvent, [ this ]);
      }
      return this.options.enable;
    },

    prepareOptions: function (options, base) {
      base = base || this.options;
      options = $.extend(true, {}, base, options);
      if (options.enable) {
        if (options.show === 'toggle') {
          options.show = this.isType('hidden', options.states);
        } else if (options.show === 'infer') {
          options.show = this.isType('shown', options.states);
        }
        if (options.toggle.position === 'infer') {
          options.toggle.position = (this.element.css('text-direction') === 'rtl') ? 'left' : 'right';
        }
      }
      return options;
    },

    updateElement: function () {
      if (! this.options.enable || this.isType()) return false;
      this.element
        .prop($.extend({}, this.options.props, this.state().props))
        .addClass([this.options.className, this.state().className].join(' '))
        .removeClass(this.otherState().className);
      return true;
    },

    isType: function (comparison, states) {
      states = states || this.options.states;
      comparison = comparison || this.state(undef, undef, states).props.type;
      if (states[comparison]) {
        comparison = states[comparison].props.type;
      }
      return this.element.prop('type') === comparison;
    },

    state: function (key, invert, states) {
      states = states || this.options.states;
      if (key === undef) {
        key = this.options.show;
      }
      if (typeof key === 'boolean') {
        key = key ? 'shown' : 'hidden';
      }
      if (invert) {
        key = (key === 'shown') ? 'hidden' : 'shown';
      }
      return states[key];
    },

    otherState: function (key) {
      return this.state(key, true);
    },

    wrapper: {
      element: $(),
      init: function (target, options) {
        var enforceWidth = options.enforceWidth
          , targetWidth;
        if (! this.element.length) {
          targetWidth = target.outerWidth();
          $.each(options.inheritStyles, $.proxy(function (index, prop) {
            options.styles[prop] = target.css(prop);
          }, this));
          target.wrap(
            $(options.element).addClass(options.className).css(options.styles)
          );
          this.element = target.parent();
          if (enforceWidth === true) {
            enforceWidth = (this.element.outerWidth() === targetWidth) ? false : targetWidth;
          }
          if (enforceWidth !== false) {
            this.element.css('width', enforceWidth);
          }
        }
        return this.element;
      }
    },

    toggle: {
      element: $(),
      init: function (action, target, wrapper, options, state, otherState, hideUntil) {
        // element
        this.element = $(options.element)
          .attr(options.attr)
          .addClass(options.className)
          .css(options.styles)
          .appendTo(wrapper);
        this.update(state, otherState);
        target.css('padding-' + options.position, this.maxWidth(state, otherState) + (options.offset * 2));
        this.position(options.position, options.verticalAlign, options.offset);
        // saving some attributes for events
        this.action = action;
        this.position = options.position;
        this.keyCodes = this.prepKeyCodes(options.attachToKeyCodes, this.element.prop('tagName'));
        // initialize event proxies
        $.each(this.events, $.proxy(function (key, handler) {
          this.proxies[key] = $.proxy(handler, this);
        }, this));
        // attach events
        if (options.touchSupport) {
          this.element.css(options.touchStyles);
          target.on(options.attachToTouchEvent, this.proxies.touch);
        } else {
          this.element.on(options.attachToEvent, this.proxies.click);
        }
        if (this.keyCodes.length) {
          this.element.on('keyup', this.proxies.keypress);
        }
        // optionally hide until event
        if (hideUntil) {
          this.element.hide();
          target.one(hideUntil, $.proxy(function(){ this.element.show(); }, this));
        }
        // return element
        return this.element;
      },
      update: function (state, otherState) {
        return this.element
          .attr(state.attr)
          .addClass(state.className)
          .removeClass(otherState.className)
          .html(state.content);
      },
      maxWidth: function (state, otherState) {
        var result = this.element.outerWidth(true);
        this.update(otherState, state);
        result = Math.max(result, this.element.outerWidth(true));
        this.update(state, otherState);
        return result;
      },
      position: function (position, verticalAlign, offset) {
        var styles = {};
        styles[position] = offset;
        switch (verticalAlign) {
          case 'top':
          case 'bottom':
            styles[verticalAlign] = offset;
            break;
          case 'middle':
            styles['top'] = '50%';
            styles['marginTop'] = this.element.outerHeight() / -2;
            break;
        }
        return this.element.css(styles);
      },
      prepKeyCodes: function (keyCodes, tagName) {
        if (keyCodes === true) {
          keyCodes = [];
          switch(tagName.toLowerCase()) {
            case 'button':
            case 'input':
              break;
            case 'a':
              if (this.element.filter('[href]').length) {
                keyCodes.push(SPACE);
                break;
              }
            default:
              keyCodes.push(SPACE, ENTER);
              break;
          }
        }
        return $.isArray(keyCodes) ? keyCodes : [];
      },
      events: {
        click: function (event) { this.action(event); },
        keypress: function (event) {
          $.each(this.keyCodes, $.proxy(function(index, keyCode){
            if (event.which === keyCode) {
              this.proxies.click(event);
              return false;
            }
          }, this));
        },
        touch: function (event) {
          var toggleX = this.element.offset().left
            , eventX
            , lesser
            , greater;
          if (toggleX) {
            eventX = event.pageX || event.originalEvent.pageX;
            if (this.position === 'left') {
              toggleX+= this.element.outerWidth();
              lesser = eventX;
              greater = toggleX;
            } else {
              lesser = toggleX;
              greater = eventX;
            }
            if (greater >= lesser) {
              this.proxies.click(event);
            }
          }
        }
      },
      proxies: {}
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