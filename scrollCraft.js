// MagicScroll.js
// Author: Nikolay Dyankov
// 2016
// GNU GENERAL PUBLIC LICENSE
// https://github.com/nikolaydyankov/magic-scroll

;(function ($, window, document, undefined) {

    // Default options
    var defaults = {

        // This option will compensate for different screen sizes.
        // Note that if this is set to true, the scrollRange parameter works
        // with relative values to the screen size, instead of absolute pixel values.
        // HIGHLY RECOMMENDED to leave this to "true" to achieve consistent results
        // accross different screen sizes!
        normalizeScrollRange: true,

        // The scrolling behaviour will occur between scrollRange[0] and scrollRange[1]
        scrollRange: [0, 0],

        // An arbitrary variable (returned value) that changes depending on
        // the current scroll position, relative to "scrollRange"
        domain: [0, 1],

        // If set to false, the "returned value" will stop changing after
        // the scroll position goes past the limit, even if the user scrolls back.
        loop: true,

        // If set to true, the "returned value" will get updated smoothly until
        // it reaches its desired value. Otherwise, it will jump straight to
        // what its value is supposed to be. This option makes the scrolling
        // behaviour much more noticeable when the browser doesn't have smooth scrolling.
        smooth: true,

        // How smooth should the "returned value" interpolate.
        // 0 to 1
        // Less is slower interpolation, more is quicker interpolation
        smoothDuration: 0.33,

        // Called when the scroll range goes past scrollRange[0]
        onStart: function() {},

        // Called continuously as the user scrolls
        // and the scroll position is between scrollRange[0] and scrollRange[1]
        onUpdate: function() {},

        // Called when the scroll position becomes greater than scrollRange[1]
        onComplete: function() {},
    }

    $.MagicScroll = function(options) {
        var magicScroll = new MagicScroll(options);
    }

    function MagicScroll(options) {
        this.options = $.extend({}, defaults, options);
        this.v = 0;

        // Variables used for interpolation. Interpolated value / target value
        this.iv = 0;
        this.tv = 0;

        // States
        this.started = false;
        this.completed = false;

        // Initialize
        this.init();
    }

    // Initialization.
    // Creates a scroll event listener and evaluates the current scroll position
    MagicScroll.prototype.init = function() {

        // Create the scroll event listener
        var self = this;
        $(window).on('scroll', function() {
            self.handleScroll($(window).scrollTop());
        });

        // Initially evaluate the scroll position
        this.handleScroll($(window).scrollTop());
    }

    // Called on each scroll event
    MagicScroll.prototype.handleScroll = function(scrollTop) {
        if (!this.completed) {
            var s = this.getScrollPosition();

            if (s >= this.options.scrollRange[0]) {
                // Fire the onStart() callback
                if (!this.started) {
                    this.started = true;
                    this.options.onStart();
                }

                // Update this.v and fire the onUpdate() callback
                this.update(s);

                if (!this.options.loop && this.v == this.options.domain[1]) {
                    // If this.v has reached its final value and looping is FALSE,
                    // fire the onComplete() callback and don't do anything else
                    this.completed = true;
                    this.options.onComplete();
                } else if (this.v == this.options.domain[1]) {
                    // If this.v has reached its final value and looping is TRUE,
                    // fire the onComplete() callback
                    this.options.onComplete();
                }
            }
        }

        // If "debug" is set to true, log the current scroll position
        // This is used to setup the script more easily
        if (this.options.debug) {
            console.log(this.getScrollPosition());
        }
    }

    MagicScroll.prototype.update = function(s) {
        if (this.options.smooth) {
            // Set the target value for the interpolator
            this.tv = this.valueForScroll(s);

            var self = this;
            // Interpolate from "this.iv" to "this.tv", over "this.options.smoothDuration" seconds
            // and fire the onUpdate() callback on each interpolation step
            this.interpolate(this.iv, this.tv, this.options.smoothDuration, function(v) {
                self.v = v;
                self.options.onUpdate(v);
            });
        } else {
            // Get the value and fire the onUpdate() callback
            this.v = this.valueForScroll(s);
            this.options.onUpdate(this.v);
        }
    };

    // Calculates the current scroll position, based on the "normalizeScrollRange"
    // and "scrollRange" parameters
    MagicScroll.prototype.getScrollPosition = function() {
        var s = 0;
        if (this.options.normalizeScrollRange) {
            // Calculate a relative scroll position, based on the window's height
            // and the scroll position in pixels
            var scrollTop = $(window).scrollTop();
            s = scrollTop / ($(document).height() - $(window).height());
        } else {
            // If "normalizeScrollRange" is false, simply return the current
            // scroll position in pixels
            s = $(window).scrollTop();
        }

        // Constrain s within scrollRange
        if (s < this.options.scrollRange[0]) s = this.options.scrollRange[0];
        if (s > this.options.scrollRange[1]) s = this.options.scrollRange[1];

        return s;
    };

    // Takes a scroll position as an argument and calculates the value, that gets
    // returned from the script
    MagicScroll.prototype.valueForScroll = function(scroll) {
        // "progress" is a value that goes from 0 to 1, depending on the current
        // scroll position and the scrollRange
        var progress = (scroll - this.options.scrollRange[0]) / (this.options.scrollRange[1] - this.options.scrollRange[0]);

        // This value is interpolated between domain[0] to domain[1], depending
        // on the "progress" variable
        var v = this.options.domain[0] + progress * (this.options.domain[1] - this.options.domain[0]);

        return v;
    };

    // Takes a starting and a target value and continuously sends updates to
    // its callback function
    MagicScroll.prototype.interpolate = function(start, target, speed, cb) {
        var self = this;
        setTimeout(function() {
            self.iv = (1 - speed) * start + speed * target;
            // This "if" statement is to prevent the function from running forever,
            // because self.iv will NEVER actually reach the target value
            // If the values are close enough, set self.iv to the target value and finish
            // Otherwise, iterate
            if (Math.abs(self.iv - self.tv) > Math.abs(self.options.domain[0] - self.options.domain[1])/100) {
                cb(self.iv);
                self.interpolate(self.iv, self.tv, speed, cb);
            } else {
                self.iv = self.tv;
                cb(self.tv);
            }
        }, 16);
    }
})(jQuery, window, document);
