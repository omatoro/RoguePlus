/**
 * スタック
 */
(function(ns) {

    ns.stack = tm.createClass({
        data : [],

        init : function (data) {
            this.data = data || this.data;
        },

        pop : function () {
            var result = data[data.length - 1];
            data.splice(data.length - 1, 1);
            return result;
        },

        push : function (data) {
            data[data.length] = data || this.data;
        }

    });

})(game);