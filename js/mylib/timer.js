/**
 * タイマー バークラスからの派生で作る
 */
(function(ns) {

    ns.Timer = tm.createClass({
    	superClass: ns.ProgressBar,

    	init: function (time, width, height, barColor, backgroundColor) {
    		this.superInit(width, height, barColor, backgroundColor);
    		this.time = time;
    		this.timeUnit = 100 / time;
    	},

        update : function () {
        	this.setBarLength(this.time * this.timeUnit);
        },

        countDown : function () {
        	--this.time;
        },

        reset : function (time) {
        	this.time = time;
        }
    });

})(game);