function MagicScroll(options) {
    var self = this;

    var defaults = {
        scrollRange: [0, 0],
        domain: [0, 0],
        onStart: function() {},
        onUpdate: function() {},
        onComplete: function() {},
    }
    options = $.extend(defaults, true, options);

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
            options.onUpdate(v);
        }

        if (scrollTop < options.scrollRange[0]) {
            var progress = 0;
            var v = options.domain[0] + progress * (options.domain[1] - options.domain[0]);
            options.onUpdate(v);
        }

        if (scrollTop > options.scrollRange[1]) {
            var progress = 1;
            var v = options.domain[0] + progress * (options.domain[1] - options.domain[0]);
            options.onUpdate(v);

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
