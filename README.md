# Hide/show password plugin for jQuery/Zepto

Because life's too short to waste time re-typing passwords.

This plugin lets you easily hide and reveal the contents of a password input field. It's based on a mobile design pattern documented [in this post by Luke Wroblewski](http://www.lukew.com/ff/entry.asp?1653) and seen in apps like [Polar](http://www.polarb.com/).

* [Explanatory blog post]()
* [Check out a demo]()

## Dependencies

hideShowPassword.js requires either [jQuery](http://jquery.com/) or [Zepto](http://zeptojs.com/), the latter with a few caveats...

### Using Zepto

Before you can use this plugin with Zepto, you'll need to make sure you've included the `data` module in your Zepto build (it is not included by default). You can do this by grabbing the `vendor/zepto.custom.js` file from this very repo, or [building Zepto yourself](https://github.com/madrobby/zepto#building).

If you plan on using the inner toggle feature of this plugin, be aware that Zepto does not include the same [methods for CSS dimensions](http://api.jquery.com/category/dimensions/) as jQuery. The plugin will fall back to the `.width()` and `.height()` methods if `.outerWidth()` and `.outerHeight()` are not available. Set your inputs' [box-sizing](https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing) to `border-box` to avoid any issues related to padding or incorrect dimensions, or include [your own outer dimension plugins](https://gist.github.com/pamelafox/1379704).

### Enabling touch enhancements

The plugin will not assume that touch is supported unless you tell it by specifying a value for the `touchSupport` option. Refer to the demo and usage examples to see how you can do this using [Modernizr](http://modernizr.com/).

## Usage

If all you need to do is change a password field's visibility, you can use the shorthand methods:

    $('#password').showPassword(); // Reveal
    $('#password').hidePassword(); // Hide
    $('#password').togglePassword(); // Toggle

You can do the same thing by passing `true`, `false` or `'toggle'` to the `hideShowPassword` method:

    $('#password').hideShowPassword(true); // Reveal
    $('#password').hideShowPassword(false); // Hide
    $('#password').hideShowPassword('toggle'); // Toggle

If you want to tweak more than the visibility, you can pass an object to `hideShowPassword`:

    $('#password').hideShowPassword({
        show: true, // Reveal the password
        innerToggle: true, // Create an inner toggle
        hideToggleUntil: 'focus', // Hide the toggle till focus
        touchSupport: Modernizr.touch // Enable touch enhancements
    });

See the options section for detailed descriptions of what's available, and [check out the demo]() for examples.

### Events

If you need to respond to changes to the password field's visibility, you can use the `passwordShown` and `passwordHidden` events:

    $('#password').on('passwordShown', function () {
        console.log('password is visible');
    }).on('passwordHidden', function () {
        console.log('password is hidden');
    });

You can change the names of the events in the options.

### Options

You can pass an options object to the `hideShowPassword` method to customize it to your liking.

Here are all the options and their defaults:

    .hideShowPassword({
        // Visibility of the password text. Can be true, false or 'toggle'.
        show: false,

        // Set to true to create an inner toggle for this input.
        innerToggle: false,

        // Specify an event for the input that should make the innerToggle
        // visible. If false, the toggle will be immediately visible.
        // Example: 'focus'
        hideToggleUntil: false,

        // By default, the innerToggle will work like any old clickable
        // element. If this is set to true, it will use touch-optimized
        // events so you can tap it on a touch device without losing
        // your input focus. If you've included Modernizr with the
        // touchevents test, you should set this value to Modernizr.touch.
        touchSupport: false,

        // Event to use for inner toggle when touchSupport is false.
        toggleEvent: 'click',

        // ...and when touchSupport is true.
        toggleTouchEvent: 'touchstart mousedown',

        // When innerToggle is true, the input needs to be wrapped in
        // a containing element. You can specify the class name of this
        // element here. Useful for custom styles.
        wrapperClass: 'hideShowPassword-wrapper',

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

            // Attributes to apply to the input element.
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
    });

## Known issues

### Competing control in IE10

Internet Explorer 10 includes its own control for toggling password visibility that can compete with this plugin when enabled.

You can disable this control for any element by specifying a style for the `::ms-reveal` pseudo-class:

    ::-ms-reveal { display: none !important; }
