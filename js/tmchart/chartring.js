/*
 * Chart Ring
 */
(function(ns) {

	ns.ChartRing = tm.createClass({
	    superClass: tm.app.Shape,

	    init: function(width, data) {
	        this.superInit(width, width);
	        this.interaction.enabled = true;
	        this.interaction.boundingType = "circle";
	        this._refresh();

	        this.backgroundColor = "red";
	        this.alpha = 1.0;

	        // 吹き出しの生成(これだと次に生成したリングの下に描画されちゃうけど、どうしようかな)
	        var baloon = ns.ChartBaloon(data);
	        baloon.effectPositionSet(0, 0);
	        this.addChild(baloon);
	        this.baloon = baloon;
	    },

	    effectPositionSet: function (x0, y0, x1, y1) {
	    	this.position.set(x0, y0);

            this.tweener.clear();
            this.tweener.
                to({"x": x1, "y": y1}, 600);
	    },

	    // 入れ子のオブジェクトのヒット判定はまだできていないのでこっちで実装
	    isHitPointRect: function (x, y) {
            // ここから下のバージョンは四角形
            var globalPos = this.parent.parent.localToGlobal(this.parent.localToGlobal(this));
            // var globalPos = this;
            
            var left   = globalPos.x - this.width*this.originX;
            var right  = globalPos.x + this.width*this.originX;
            var top    = globalPos.y - this.height*this.originY;
            var bottom = globalPos.y + this.height*this.originY;
            
            if ( left < x && x < right && top  < y && y < bottom ) { return true; }
            
            return false;
	    },

	    update: function (app) {
	    	// マウスオーバー時に吹き出しを表示する
	    	var mousePosition = app.pointing;
	    	if (this.isHitPointRect(mousePosition.x, mousePosition.y)) {
	        	this.baloon.onDisplay();
	    	}
	    	else {
	    		this.baloon.offDisplay();
	    	}
	    },

	    _refresh: function () {
	        // 描画
	        var c = this.canvas;
	        c.resize(this.width, this.width);

	        // 外枠
	        c.strokeStyle   = ns.ChartRing.BACK_GRADIENT_COLOR_CENTER;
	        var lineWidth   = this.width/4;
	        c.lineWidth     = lineWidth;
	        c.strokeRoundRect(lineWidth/2, lineWidth/2, this.width-(lineWidth), this.width-(lineWidth), (this.width-(lineWidth))/2);

	        // 穴の部分
	        c.fillStyle = "rgba(0,0,0,0.3)";
	        c.lineWidth = 0;
	        c.fillRoundRect(lineWidth, lineWidth, this.width-(lineWidth*2), this.width-(lineWidth*2), (this.width-(lineWidth*2))/2);
	    }
	});

	ns.ChartRing.IN_STROKE_COLOR  = "rgba(20, 80, 180, 1.0)";
	ns.ChartRing.BACK_GRADIENT_COLOR_TOP    = "rgba(120, 160, 245, 1.0)";
	ns.ChartRing.BACK_GRADIENT_COLOR_CENTER = "rgba(55, 120, 220, 1.0)";
	ns.ChartRing.BACK_GRADIENT_COLOR_BOTTOM = "rgba(35, 95, 220, 1.0)";

})(game);