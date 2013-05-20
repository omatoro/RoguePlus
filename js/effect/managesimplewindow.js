/*
 * ManageSimpleWindows
 */
(function(ns) {

	var WINDOW_WIDTH = 180;
	var WINDOW_HEIGHT = 150;
	var WINDOW_PADDING = 20;

	var WINDOW_DRAW_POSITION_X = WINDOW_WIDTH/2  + WINDOW_PADDING;
	var WINDOW_DRAW_POSITION_Y = WINDOW_HEIGHT/2 + WINDOW_PADDING + 100;

	ns.ManageSimpleWindows = tm.createClass({

	    init: function(scene) {
	    	this.name = "asdfasdf";
	    	this.windowGroup = tm.app.CanvasElement();
	    	scene.addChild(this.windowGroup);
	    },

	    add: function (text) {
	    	// 既にあるウィンドウをずらす
	    	for (var i = 0; i < this.windowGroup.children.length-1; ++i) {
	    		this.windowGroup.children[i].moveby(0, WINDOW_HEIGHT + WINDOW_PADDING);
	    	}

	    	if (this.windowGroup.children.length !== 0) {
		    	this.windowGroup.children[this.windowGroup.children.length-1].moveby(
		    		0,
		    		WINDOW_HEIGHT + WINDOW_PADDING,
		    		(function () {
				    	// ウィンドウを追加
				    	var simpleWindow = ns.SimpleMessageWindow(text);
				    	simpleWindow.position.set(WINDOW_DRAW_POSITION_X, WINDOW_DRAW_POSITION_Y);
				    	this.windowGroup.addChild(simpleWindow);
				    	console.dir(this);
		    		}).bind(this)
	    		);
		    }
		    else {
		    	// ウィンドウを追加
		    	var simpleWindow = ns.SimpleMessageWindow(text);
		    	simpleWindow.position.set(WINDOW_DRAW_POSITION_X, WINDOW_DRAW_POSITION_Y);
		    	this.windowGroup.addChild(simpleWindow);
		    	console.dir(this);
		    }
	    },

	    update: function () {
	    },
	});

})(game);