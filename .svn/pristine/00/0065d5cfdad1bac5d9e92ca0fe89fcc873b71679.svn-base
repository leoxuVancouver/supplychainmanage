/// <reference path="jquery-1.9.1.min.js" />

(function ($) {
    $.fn.highlight = function (options) {
        options = $.extend({
            currClass: 'current',
            menuTarget: 'a',
            compar: 'href'
        }, options);
        return this.each(function (i) {
            var $this = $(this);
            var locaPath = window.location.pathname;
            var pageName = decodeURI(locaPath.substr(locaPath.lastIndexOf('/'), locaPath.length));
            $this.find(options.menuTarget).each(function (i) {
                if (('/' + $(this).attr(options.compar)).indexOf(pageName) > -1) {
                    $(this).addClass(options.currClass);
                }
            });
        });
    };
})(jQuery);
