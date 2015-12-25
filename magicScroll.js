// Options: { scrollRange: [], domain: [], onUpdate: function() {}, onComplete: function() {} }
function MagicScroll(options) {
    options.onUpdate(options.domain[0]);

    $(window).on('scroll', function() {
        var scrollTop = $(window).scrollTop();

        if (scrollTop >= options.scrollRange[0] && scrollTop <= options.scrollRange[1]) {
            var progress = (scrollTop - options.scrollRange[0]) / (options.scrollRange[1] - options.scrollRange[0]);
            var v = options.domain[0] + progress * (options.domain[1] - options.domain[0]);
            options.onUpdate(v);
        }

        if (options.debug) {
            console.log('Scroll position: ' + scrollTop);
        }
    });
}
