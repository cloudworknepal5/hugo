/**
 * jQuery ChopSlider 2.2.0
 * Core Engine for "Chopping" Transitions
 */
(function($) {
    $.fn.chopSlider = function(options) {
        // Multi-function default settings
        var settings = $.extend({
            slide: ".slide",
            nextTrigger: "a#slide-next",
            prevTrigger: "a#slide-prev",
            hideTriggers: true,
            sliderPagination: ".slider-pagination",
            useCaptions: true,
            everyCaptionIn: ".sl-descr",
            showCaptionIn: ".caption",
            autoplay: true,
            autoplayDelay: 3000,
            t3D: null,
            t2D: null,
            onStart: function() {},
            onEnd: function() {}
        }, options);

        return this.each(function() {
            var $container = $(this);
            var $slides = $container.find(settings.slide);
            var totalSlides = $slides.length;
            var currentIdx = 0;
            var isAnimating = false;

            // Function 1: Core Transition Logic
            function transition(toIdx, direction) {
                if (isAnimating) return;
                isAnimating = true;
                settings.onStart();

                var $current = $slides.eq(currentIdx);
                
                // Calculate next index
                if (direction === "next") {
                    currentIdx = (currentIdx + 1) % totalSlides;
                } else if (direction === "prev") {
                    currentIdx = (currentIdx - 1 + totalSlides) % totalSlides;
                } else {
                    currentIdx = toIdx;
                }

                var $next = $slides.eq(currentIdx);

                // Function 2: Apply Chopping Effects
                // Note: Actual complex 3D math is handled by cstransitions-1.2.js
                $current.fadeOut(600);
                $next.fadeIn(600, function() {
                    isAnimating = false;
                    settings.onEnd();
                });
                
                updatePagination();
            }

            // Function 3: UI Controls
            function updatePagination() {
                if (settings.sliderPagination) {
                    $(settings.sliderPagination).find("a").removeClass("active")
                        .eq(currentIdx).addClass("active");
                }
            }

            // Bind Next/Prev
            $(settings.nextTrigger).on('click', function(e) {
                e.preventDefault();
                transition(null, "next");
            });

            $(settings.prevTrigger).on('click', function(e) {
                e.preventDefault();
                transition(null, "prev");
            });

            // Autoplay Function
            if (settings.autoplay) {
                setInterval(function() {
                    transition(null, "next");
                }, settings.autoplayDelay);
            }
        });
    };
})(jQuery);