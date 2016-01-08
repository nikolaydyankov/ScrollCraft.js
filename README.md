# MagicScroll.js

A JavaScript helper class to help you create parallax and other scrolling behaviours.

### Installation

```sh
bower install magic-scroll --save
```

### How to Use

```
$.MagicScroll({
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
