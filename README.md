# ScrollCraft.js

A JavaScript helper class to help you create parallax and other scrolling behaviours.

### Installation

```sh
bower install scroll-craft --save
```

### How to Use

```
$.ScrollCraft({
    scrollRange: [0, 0.25],
    onStart: function() {
        $('#my-element').addClass('active');
    },
    onUpdate: function(v) {
        $('#my-element').css({ "transform" : "translateY("+ v +"px)" });
    },
    onComplete: function() {
        $('#my-element').removeClass('active');
    },
});
```

### Options

  - `scrollRange` (array, default: [0, 0]) - The scrolling behaviour will occur between scrollRange[0] and scrollRange[1]
  If normalizeScrollRange is disabled, this parameter will take pixels
  It's best to enable the "debug" option to set proper values for scrollRange.

  - `normalizeScrollRange` (boolean, default: true) - This option will compensate for different screen sizes.
  Note that if this is set to true, the scrollRange parameter works
  with relative values to the screen size, instead of absolute pixel values.
  HIGHLY RECOMMENDED to leave this to "true" to achieve consistent results
  accross different screen sizes!

  - `domain` (array, default: [0, 1]) - An arbitrary variable, returned with the onUpdate() callback,
  that changes based on the current scroll position.

  - `loop` (boolean, default: true) - If set to false, the "returned value" will stop changing after
        the scroll position goes past the limit, even if the user scrolls back.

  - `smooth` (boolean, default: true) - If set to true, the "returned value" will get updated smoothly until
        it reaches its desired value. Otherwise, it will jump straight to
        what its value is supposed to be. This option makes the scrolling
        behaviour much more noticeable when the browser doesn't have smooth scrolling.

  - `smoothDuration` (number from 0 to 1, default: 0.33) - How smooth should the "returned value" interpolate. Less is slower interpolation, more is quicker interpolation.

  - `onStart()` (function) - Called when the scroll range goes past scrollRange[0]

  - `onUpdate()` (function) - Called continuously as the user scrolls
        and the scroll position is between scrollRange[0] and scrollRange[1]

  - `onComplete()` (function) - Called when the scroll position becomes greater than scrollRange[1]

  - `debug` (boolean, default: false) - If enabled, it will log the current scroll position of the window
  to the console, so you can more easily set the "scrollRange" values.
