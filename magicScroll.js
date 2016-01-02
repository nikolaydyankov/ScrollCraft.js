function MagicScroll(options) {
    var self = this;

    var defaults = {
        scrollRange: [0, 0],
        domain: [0, 0],
        loop: true,
        smooth: true,
        smoothFactor: 0.1,
        onStart: function() {},
        onUpdate: function() {},
        onComplete: function() {},
    }
    options = $.extend(defaults, true, options);

    self.currentVal = 0;
    self.targetVal = 0;
    self.currentScroll = 0;
    self.targetScroll = 0;
    self.started = false;
    self.completed = false;
    options.onUpdate(options.domain[0]);

    $(window).on('scroll', function() {
        var scrollTop = $(window).scrollTop();

        if (scrollTop >= options.scrollRange[0] && scrollTop <= options.scrollRange[1]) {
            if (!self.started) {
                self.started = true;
                options.onStart();
            }

            var progress = (scrollTop - options.scrollRange[0]) / (options.scrollRange[1] - options.scrollRange[0]);
            var v = options.domain[0] + progress * (options.domain[1] - options.domain[0]);

            if (!self.completed || options.loop) {
                if (options.smooth) {
                    self.targetVal = v;
                    self.interpolate(self.currentVal, self.targetVal, options.smoothFactor, function(v) {
                        options.onUpdate(v);
                    });
                } else {
                    options.onUpdate(v);
                }
            }
        }

        if (scrollTop < options.scrollRange[0]) {
            var progress = 0;
            var v = options.domain[0] + progress * (options.domain[1] - options.domain[0]);

            if (!self.completed || options.loop) {
                if (options.smooth) {
                    self.targetVal = v;
                    self.interpolate(self.currentVal, self.targetVal, options.smoothFactor, function(v) {
                        options.onUpdate(v);
                    });
                } else {
                    options.onUpdate(v);
                }
            }
        }

        if (scrollTop > options.scrollRange[1]) {
            var progress = 1;
            var v = options.domain[0] + progress * (options.domain[1] - options.domain[0]);
            if (options.smooth) {
                self.targetVal = v;
                self.interpolate(self.currentVal, self.targetVal, options.smoothFactor, function(v) {
                    options.onUpdate(v);
                });
            } else {
                options.onUpdate(v);
            }

            if (!self.completed) {
                self.completed = true;
                options.onComplete();
            }
        }

        if (options.debug) {
            console.log('Scroll position: ' + scrollTop);
        }
    });
}
MagicScroll.prototype.interpolate = function (start, target, speed, cb) {
    var self = this;
    setTimeout(function() {
        self.currentVal = (1-speed)*start + speed*target;
        if (Math.abs(self.currentVal - self.targetVal) > 1) {
            cb(self.currentVal);
            self.interpolate(self.currentVal, self.targetVal, speed, cb);
        } else {
            self.currentVal = self.targetVal;
            cb(self.targetVal);
        }
    }, 16);
}
