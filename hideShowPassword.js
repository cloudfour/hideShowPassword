(function (factory, global) {

  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else {
    // Browser globals.
    factory(global.jQuery);
  }

}(function ($, undef) {

  var dataKey = 'plugin_hideShowPassword';

  var defaults = {

    show: 'infer',
    replaceElement: false,
    className: 'hideShowPassword-field',
    eventName: 'passwordVisibilityChange',

    props: {
      autocapitalize: 'off',
      autocomplete: 'off',
      autocorrect: 'off',
      spellcheck: 'false'
    },

    states: {
      shown: {
        className: 'hideShowPassword-shown',
        eventName: 'passwordShown',
        props: { type: 'text' }
      },
      hidden: {
        className: 'hideShowPassword-hidden',
        eventName: 'passwordHidden',
        props: { type: 'password' }
      }
    }

  };

  function HideShowPassword (element, options) {
    this.element = $(element);
    this.init(options);
  }

  HideShowPassword.prototype = {

    init: function (options) {
      this.update(options, defaults);
    },

    update: function (options, base) {
      var element = this.element
        , currentType = element.prop('type');
      // update options
      base = base || this.options;
      if (typeof options !== 'object') {
        options = { show: options };
      }
      options = $.extend(true, {}, base, options);
      if (options.show === 'toggle') {
        options.show = (currentType === options.states.hidden.props.type);
      }
      if (options.show === 'infer') {
        options.show = (currentType === options.states.shown.props.type);
      }
      this.options = options;
      // update element
      if (currentType !== this.state().props.type) {
        if (this.options.replaceElement) {
          element = element.clone(true);
        }
        element
          .prop($.extend({}, this.options.props, this.state().props))
          .addClass(this.options.className + ' ' + this.state().className)
          .removeClass(this.otherState().className);
        if (this.options.replaceElement) {
          this.element.replaceWith(element);
        }
        this.element
          .trigger(this.options.eventName)
          .trigger(this.state().eventName);
      }
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
    }

  };

/*  //   updateElement: function () {
  //     var element = (this.options.replaceInput) ? this.element.clone(true) : this.element;
  //     element
  //       .prop(this.state().props)
  //       .addClass(this.options.inputClass + ' ' + this.state().inputClass)
  //       .removeClass(this.otherState().inputClass);
  //     if (this.options.replaceInput)
  //       this.element.replaceWith(element);
  //     element.trigger(this.options.eventName).trigger(this.state().eventName);
  //   }*/

  // var dataKey = 'plugin_hideshowPassword';

  // var defaults = {

  //   show: 'infer',

  //   touchSupport: false,
  //   replaceInput: false,

  //   inputClass: 'hideShowPassword-field',

  //   innerToggle: false,
  //   toggleElement: '<button>',
  //   toggleClass: 'hideShowPassword-toggle',
  //   hideToggleUntil: false,
  //   toggleEvent: 'click',
  //   toggleTouchEvent: 'touchstart mousedown',
  //   toggleKeyCodes: [
  //     13, // ENTER
  //     32  // SPACE
  //   ],
  //   toggleAttachment: 'infer',
  //   toggleValign: 'middle',
  //   toggleStyles: { position: 'absolute' },
  //   wrapperElement: '<div>',
  //   wrapperClass: 'hideShowPassword-wrapper',
  //   wrapperWidth: true,
  //   wrapperStyles: { position: 'relative' },
  //   wrapperStylePropsFromInput: [
  //     'display',
  //     'vertical-align',
  //     'margin-top',
  //     'margin-right',
  //     'margin-bottom',
  //     'margin-left'
  //   ],
  //   wrappedInputStyles: {
  //     'margin-top': 0,
  //     'margin-right': 0,
  //     'margin-bottom': 0,
  //     'margin-left': 0
  //   },

  //   eventName: 'passwordVisibilityChanged',

  //   states: {
  //     shown: {
  //       eventName: 'passwordShown',
  //       inputClass: 'hideShowPassword-shown',
  //       props: {
  //         'type': 'text',
  //         'autocapitalize': 'off',
  //         'autocomplete': 'off',
  //         'autocorrect': 'off',
  //         'spellcheck': 'false'
  //       },
  //       toggleClass: 'hideShowPassword-toggle-hide',
  //       toggleText: 'Hide',
  //       toggleAttr: { 'aria-pressed': 'true' }
  //     },
  //     hidden: {
  //       eventName: 'passwordHidden',
  //       inputClass: 'hideShowPassword-hidden',
  //       props: { 'type': 'password' },
  //       toggleClass: 'hideShowPassword-toggle-show',
  //       toggleText: 'Show',
  //       toggleAttr: { 'aria-pressed': 'false' }
  //     }
  //   }

  // };

  // function HideShowPassword (element, options) {
  //   this.element = $(element);
  //   this.init(options);
  // }

  // HideShowPassword.prototype = {

  //   init: function (options) {
  //     this.update(options, defaults);
  //     if (this.options.innerToggle)
  //       this.initInnerToggle();
  //   },

  //   update: function (options, base) {
  //     var currentType = this.element.prop('type');
  //     // update options
  //     base = base || this.options;
  //     if (typeof options !== 'object')
  //       options = { show: options };
  //     options = $.extend(true, {}, base, options);
  //     if (options.show === 'toggle')
  //       options.show = currentType === options.states.hidden.props.type;
  //     if (options.show === 'infer')
  //       options.show = currentType === options.states.shown.props.type;
  //     if (options.toggleAttachment === 'infer')
  //       options.toggleAttachment = (this.element.css('direction') === 'rtl') ? 'left' : 'right';
  //     this.options = options;
  //     // update element (if necessary)
  //     if (currentType !== this.state().props.type)
  //       this.updateElement();
  //   },

  //   updateElement: function () {
  //     var element = (this.options.replaceInput) ? this.element.clone(true) : this.element;
  //     element
  //       .prop(this.state().props)
  //       .addClass(this.options.inputClass + ' ' + this.state().inputClass)
  //       .removeClass(this.otherState().inputClass);
  //     if (this.options.replaceInput)
  //       this.element.replaceWith(element);
  //     element.trigger(this.options.eventName).trigger(this.state().eventName);
  //   },

  //   toggle: function () {
  //     this.update('toggle');
  //   },

  //   stateKey: function () {
  //     return this.options.show ? 'shown' : 'hidden';
  //   },

  //   otherStateKey: function () {
  //     return this.options.show ? 'hidden' : 'shown';
  //   },

  //   state: function () {
  //     return this.options.states[this.stateKey()];
  //   },

  //   otherState: function () {
  //     return this.options.states[this.otherStateKey()];
  //   },

  //   initInnerToggle: function () {
  //     var wrapperStyles = this.options.wrapperStyles
  //       , toggleStyles = this.options.toggleStyles
  //       , inputStyles = this.options.wrappedInputStyles
  //       , inputWidth = this.element.outerWidth()
  //       , eventName = ''
  //       , wrapper
  //       , toggle;

  //     $.each(this.options.wrapperStylePropsFromInput, $.proxy(function (index, prop) {
  //       wrapperStyles[prop] = this.element.css(prop);
  //     }, this));

  //     wrapper = $(this.options.wrapperElement).addClass(this.options.wrapperClass).css(wrapperStyles);
  //     this.element.wrap(wrapper);
  //     wrapper = this.element.parent();

  //     this.element.css(inputStyles);

  //     if (this.options.wrapperWidth === true && wrapper.outerWidth() !== inputWidth) {
  //       wrapper.css('width', inputWidth);
  //     } else if (this.options.wrapperWidth !== false) {
  //       wrapper.css('width', this.options.wrapperWidth);
  //     }

  //     toggle = $(this.options.toggleElement).addClass(this.options.toggleClass);

  //     toggle.css(toggleStyles).appendTo(wrapper);

  //     this.updateInnerToggle(toggle);

  //     if (this.options.toggleAttachment) {
  //       toggle.css(this.options.toggleAttachment, 0);
  //       this.element.css('padding-' + this.options.toggleAttachment, toggle.outerWidth());
  //     }

  //     switch (this.options.toggleValign) {
  //       case 'top':
  //       case 'bottom':
  //         toggle.css(this.options.toggleValign, 0);
  //         break;
  //       case 'middle':
  //         toggle.css({
  //           'top': '50%',
  //           'margin-top': (toggle.outerHeight() / -2)
  //         });
  //         break;
  //     }

  //     toggle.on(this.options.toggleEvent, $.proxy(function (event) {
  //       event.preventDefault();
  //       this.toggle();
  //     }, this));

  //     this.element.on(this.options.eventName, $.proxy(function () {
  //       this.updateInnerToggle(toggle);
  //     }, this));
  //   },

  //   updateInnerToggle: function (toggle) {
  //     toggle
  //       .attr(this.state().toggleAttr)
  //       .addClass(this.state().toggleClass)
  //       .removeClass(this.state().removeClass)
  //       .text(this.state().toggleText);
  //   }

  // };

  $.fn.hideShowPassword = function (options) {
    return this.each(function(){
      var $this = $(this);
      var data = $this.data(dataKey);
      if (data) {
        data.update(options);
      } else {
        $this.data(dataKey, new HideShowPassword(this, options));
      }
    });
  };

}, this));