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
    touchSupport: (typeof Modernizr === 'undefined') ? false : Modernizr.touch,
    hideMsReveal: true,
    enable: canSetInputAttribute,

    className: 'hideShowPassword-field',
    eventName: 'passwordVisibilityChange',
    props: {
      autocapitalize: 'off',
      autocomplete: 'off',
      autocorrect: 'off',
      spellcheck: 'false'
    },

    toggle: {
      element: '<button type="button">',
      className: 'hideShowPassword-toggle',
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
    // $.each(this.toggleEvents, $.proxy(function(key, callback){
    //   this.toggleEventProxies[key] = $.proxy(callback, this);
    // }, this));
    this.element = $(element);
    this.wrapperElement = $();
    this.toggleElement = $();
    this.init(options);
  }

  HideShowPassword.prototype = {

    init: function (options) {
      if (this.update(options, defaults)) {
        if (this.options.hideMsReveal) {
          $('<style> ' + (this.options.className || '') + '::-ms-reveal { display: none !important; } </style>').appendTo('head');
        }
      }
      // this.update(options, defaults);
      // if (this.options.enable) {

      // }
      // this.update(options, defaults);
      // if (this.options.enable) {
      //   if (this.options.hideMsReveal) {
      //     $('<style> ' + this.options.className + '::-ms-reveal { display: none !important; } </style>').appendTo('head');
      //   }
      //   // if (this.options.innerToggle) {
      //   //   this.initWrapper();
      //   //   this.initToggle();
      //   // }
      // }
    },

    update: function (options, base) {
      // base = base || this.options;
      // this.options = $.extend(true, {}, base, options);
      // if (! this.options.enable) return;
      this.options = this.prepareOptions(options, base);
      if (this.updateElement()) {
        this.element
          .trigger(this.options.eventName)
          .trigger(this.state().eventName);
      }
      return this.options.enable;
      // base = base || this.options;
      // this.options = $.extend(true, {}, base, options);
      // if (! this.options.enable) return;
      // switch (this.options.show) {
      //   case 'toggle': this.options.show = this.isType('hidden'); break;
      //   case 'infer':  this.options.show = this.isType('shown');  break;
      // }
      // // if (this.options.toggle.position === 'infer') {
      // //   this.options.toggle.position = (this.element.css('text-direction') === 'rtl') ? 'left' : 'right';
      // // }
      // if (! this.isType()) {
      //   this.element
      //     .prop($.extend({}, this.options.props, this.state().props))
      //     .addClass(this.options.className + ' ' + this.state().className)
      //     .removeClass(this.otherState().className);
      //   // this.updateToggle();
      //   this.element
      //     .trigger(this.options.eventName)
      //     .trigger(this.state().eventName);
      // }
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

    toggle: function () {
      this.update({ show: 'toggle' });
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
    }//,

    // initWrapper: function () {
    //   var wrapperStyles = this.options.wrapper.styles
    //     , enforceWidth = this.options.wrapper.enforceWidth
    //     , elementWidth = this.element.outerWidth();

    //   $.each(this.options.wrapper.inheritStyles, $.proxy(function (index, prop) {
    //     wrapperStyles[prop] = this.element.css(prop);
    //   }, this));

    //   this.element.wrap(
    //     $(this.options.wrapper.element)
    //       .addClass(this.options.wrapper.className)
    //       .css(wrapperStyles)
    //   );
    //   this.wrapperElement = this.element.parent();

    //   this.element.css(this.options.wrapper.innerElementStyles);

    //   if (enforceWidth === true) {
    //     enforceWidth = (this.wrapperElement.outerWidth() === elementWidth) ? false : elementWidth;
    //   }
    //   if (enforceWidth !== false) {
    //     this.wrapperElement.css('width', enforceWidth);
    //   }
    // },

    // initToggle: function () {
    //   var comparisonWidth;
    //   this.toggleElement = $(this.options.toggle.element)
    //     .attr(this.options.toggle.attr)
    //     .addClass(this.options.toggle.className)
    //     .css(this.options.toggle.styles)
    //     .css(this.options.toggle.position, this.options.toggle.offset)
    //     .appendTo(this.wrapperElement);

    //   this.updateToggle(true);
    //   comparisonWidth = this.toggleElement.outerWidth();
    //   this.updateToggle();
    //   this.element.css('padding-' + this.options.toggle.position, Math.max(comparisonWidth, this.toggleElement.outerWidth()));

    //   switch (this.options.toggle.verticalAlign) {
    //     case 'top':
    //     case 'bottom':
    //       this.toggleElement.css(this.options.toggle.verticalAlign, this.options.toggle.offset);
    //       break;
    //     case 'middle':
    //       this.toggleElement.css({
    //         top: '50%',
    //         marginTop: (this.toggleElement.outerHeight() / -2)
    //       });
    //       break;
    //     case 'stretch':
    //       this.toggleElement.css({
    //         top: this.options.toggle.offset,
    //         bottom: this.options.toggle.offset
    //       });
    //       break;
    //   }

    //   if (this.options.touchSupport) {
    //     this.toggleElement.css(this.options.toggle.touchStyles);
    //     this.element.on(this.options.toggle.attachToTouchEvent, this.toggleEventProxies.touch);
    //   } else {
    //     this.toggleElement.on(this.options.toggle.attachToEvent, this.toggleEventProxies.click);
    //   }

    //   if (this.options.toggle.attachToKeyCodes) {
    //     var keyCodes = this.options.toggle.attachToKeyCodes;
    //     if (keyCodes === true) {
    //       keyCodes = [];
    //       switch (this.toggleElement.prop('tagName').toLowerCase()) {
    //         case 'button':
    //         case 'input':
    //           break;
    //         case 'a':
    //           if (this.toggleElement.filter('[href]').length) {
    //             keyCodes.push(SPACE);
    //             break;
    //           }
    //         default:
    //           keyCodes.push(SPACE, ENTER); break;
    //       }
    //       this.options.toggle.attachToKeyCodes = keyCodes;
    //     }
    //     if (keyCodes.length) {
    //       this.toggleElement.on('keyup', this.toggleEventProxies.keypress);
    //     }
    //   }

    //   if (typeof this.options.innerToggle === 'string') {
    //     this.toggleElement.hide();
    //     this.element.one(this.options.innerToggle, $.proxy(function(){
    //       this.toggleElement.show();
    //     }, this));
    //   }

    // },

    // toggleEvents: {
    //   click: function (event) {
    //     event.preventDefault();
    //     this.toggle();
    //   },
    //   touch: function (event) {
    //     var toggleX = this.toggleElement.offset().left
    //       , eventX
    //       , lesser
    //       , greater;
    //     if (toggleX) {
    //       eventX = event.pageX || event.originalEvent.pageX;
    //       if (this.options.toggle.position === 'left') {
    //         toggleX+= this.toggleElement.outerWidth();
    //         lesser = eventX;
    //         greater = toggleX;
    //       } else {
    //         lesser = toggleX;
    //         greater = eventX;
    //       }
    //       if (greater >= lesser) {
    //         this.toggleEventProxies.click(event);
    //       }
    //     }
    //   },
    //   keypress: function (event) {
    //     $.each(this.options.toggle.attachToKeyCodes, $.proxy(function(index, keyCode){
    //       if (event.which === keyCode) {
    //         this.toggleEventProxies.click(event);
    //         return false;
    //       }
    //     }, this));
    //   }
    // },

    // toggleEventProxies: {},

    // updateToggle: function (invert) {
    //   var state = invert ? this.otherState() : this.state()
    //     , other = invert ? this.state() : this.otherState();
    //   this.toggleElement
    //     .attr(state.toggle.attr)
    //     .addClass(state.toggle.className)
    //     .removeClass(other.toggle.className)
    //     .html(state.toggle.content);
    // }

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