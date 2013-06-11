/*
 * OnePlayAnimationSprite
 */
(function(ns) {

	tm.define("ns.OnePlayAnimationSprite", {
	    superClass: tm.app.AnimationSprite,

	    init: function(width, height, ss) {
	    	this.superInit(ss, width, height);
	    },

	    update: function () {
	        if (this.isAnimation === false) {
	        	this.remove();
	        }
	    }
	});

})(game);