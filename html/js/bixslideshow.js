/* *
 *  bixslideshow.js
 *  Created on 18-8-14 23:06
 *  
 *  @author Matthijs Alles
 *  @copyright Copyright (C)2014 Bixie.nl
 *
 *  uses dotnav css component
 */


(function (addon) {
    "use strict";

    var component;

    if (jQuery && jQuery.UIkit) {
        component = addon(jQuery, jQuery.UIkit);
    }

    if (typeof define == "function" && define.amd) {
        define("uikit-bixslideshow", ["uikit"], function () {
            return component || addon(jQuery, jQuery.UIkit);
        });
    }


})(function ($, UI) {

    UI.component('bixslideshow', {

        defaults: {
            delay: 5000,
            nav: true,
            switch: 'hide'
        },

        init: function () {
            var $this = this, i = 0;
            //init nav
            this.navList = $('<ul class="uk-dotnav"></ul>').css({
                position: 'absolute', bottom: '0px'
            }).on('mouseenter mouseleave', function (e) {
                $this.blocked = e.type == 'mouseleave';
            });
            //get slides
            this.slides = {};
            this.find('> div').hide().each(function () {
                $this.navList.append($('<li><a href="#">Slide ' + (i + 1) + '</a></li>').data('bixSlideIndex', i).click(function (e) {
                    e.preventDefault();
                    $this.showSlide($(this).data('bixSlideIndex'));
                    $this.reset();
                }));
                $this.slides[i] = $(this);
                i++;
            });
            //init vars
            this.currentIndex = -1;
            this.count = i;
            this.blocked = false;
            this.interval = 0;
            //slide it!
            this.showSlide(0);
            this.reset();
            //show nav
            if (this.options.nav) {
                this.element.append(this.navList);
            }
            //prevent slide when mouse is in
            this.element.on('mouseenter mouseleave', function (e) {
                $this.blocked = e.type == 'mouseenter';
            });
        },
        reset: function () {
            //restart interval
            if (this.interval) clearInterval(this.interval);
            this.startShow();
        },
        startShow: function () {
            var $this = this;
            this.interval = setInterval(function () {
                $this.navigate(1);
            }, this.options.delay);
        },
        navigate: function (dir) {
            var index = dir > 0 ? this.currentIndex < (this.count - 1) ? this.currentIndex + dir : 0 :
                this.currentIndex > 0 ? this.currentIndex + dir : this.count;
            this.showSlide(index);
        },
        showSlide: function (index) {
            if (index == this.currentIndex || this.blocked) return;
            var switchFunction = this.options.switch == 'fade' ? 'fadeOut' : 'hide';
            if (this.currentIndex !== -1) this.slides[this.currentIndex].trigger('bix.slideshow.hide')[switchFunction]();
            this.currentIndex = index;
            this.slides[index].show().trigger('bix.slideshow.visible');
            this.navList.find('li').removeClass('uk-active');
            this.navList.find('li:nth-child(' + (index + 1) + ')').addClass('uk-active');
            //fire scrollspy elements in slide
            UI.$doc.trigger('uk-scroll');
        }
    });

    // init code
    UI.ready(function (context) {

        $("[data-bix-slideshow]", context).each(function () {

            var $ele = $(this);

            if (!$ele.data("bixslideshow")) {
                UI.bixslideshow($ele, UI.Utils.options($ele.attr('data-bix-slideshow')));
            }
        });

    });

    return $.fn.ukbixslideshow;
});
