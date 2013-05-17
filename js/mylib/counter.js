/**
 * カウント用
 */
(function(ns) {

    ns.Counter = tm.createClass({
        count : 0,

        init : function(_back) {
            this.initCount();
        },

        initCount : function () {
            this.count = 0;
        },

        init : function () {
            this.count = 0;
        },

        up : function () {
            ++this.count;
        },

        get : function () {
            return this.count;
        }
    });

})(game);