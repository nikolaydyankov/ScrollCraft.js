function MagicScroll(options) {
    var self = this;

    var defaults = {
        scrollRange: [0, 0],
        domain: [0, 0],
        loop: true,
        smooth: true,
        smoothFactor: 0.2,
        onStart: function() {},
        onUpdate: function() {},
        onComplete: function() {},
    }
    self.options = $.extend(defaults, true, options);

    self.currentVal = 0;
    self.targetVal = 0;
    self.currentScroll = 0;
    self.targetScroll = 0;
    self.started = false;
    self.completed = false;

    self.handleScroll($(window).scrollTop());

    $(window).on('scroll', function() {
        self.handleScroll($(window).scrollTop());
    });
}
MagicScroll.prototype.handleScroll = function(scrollTop) {
    var self = this;

    if (scrollTop >= self.options.scrollRange[0] && scrollTop <= self.options.scrollRange[1]) {
        if (!self.started) {
            self.started = true;
            self.options.onStart();
            self.options.onUpdate(self.options.domain[0]);
        }

        var progress = (scrollTop - self.options.scrollRange[0]) / (self.options.scrollRange[1] - self.options.scrollRange[0]);
        var v = self.options.domain[0] + progress * (self.options.domain[1] - self.options.domain[0]);

        if (!self.completed || self.options.loop) {
            if (self.options.smooth) {
                self.targetVal = v;
                self.interpolate(self.currentVal, self.targetVal, self.options.smoothFactor, function(v) {
                    self.options.onUpdate(v);
                });
            } else {
                self.options.onUpdate(v);
            }
        }
    }

    if (scrollTop < self.options.scrollRange[0]) {
        var progress = 0;
        var v = self.options.domain[0] + progress * (self.options.domain[1] - self.options.domain[0]);

        if (!self.completed || self.options.loop) {
            if (self.options.smooth) {
                self.targetVal = v;
                self.interpolate(self.currentVal, self.targetVal, self.options.smoothFactor, function(v) {
                    self.options.onUpdate(v);
                });
            } else {
                self.options.onUpdate(v);
            }
        }
    }

    if (scrollTop > self.options.scrollRange[1]) {
        if (!self.started) {
            self.started = true;
            self.options.onStart();
            self.options.onUpdate(self.options.domain[0]);
        }

        var progress = 1;
        var v = self.options.domain[0] + progress * (self.options.domain[1] - self.options.domain[0]);

        if (self.options.smooth) {
            self.targetVal = v;
            self.interpolate(self.currentVal, self.targetVal, self.options.smoothFactor, function(v) {
                self.options.onUpdate(v);

                if (v == self.options.domain[1]) {
                    if (!self.completed) {
                        self.completed = true;
                        self.options.onComplete();
                    }
                }
            });
        } else {
            self.options.onUpdate(v);
            if (!self.completed) {
                self.completed = true;
                self.options.onComplete();
            }
        }

    }

    if (self.options.debug) {
        console.log('Scroll position: ' + scrollTop);
    }
}
MagicScroll.prototype.interpolate = function(start, target, speed, cb) {
    var self = this;
    setTimeout(function() {
        self.currentVal = (1-speed)*start + speed*target;
        if (Math.abs(self.currentVal - self.targetVal) > Math.abs(self.options.domain[0] - self.options.domain[1])/100) {
            cb(self.currentVal);
            self.interpolate(self.currentVal, self.targetVal, speed, cb);
        } else {
            self.currentVal = self.targetVal;
            cb(self.targetVal);
        }
    }, 16);
}
