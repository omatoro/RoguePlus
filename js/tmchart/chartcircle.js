/*
 * Chart Circle
 */
(function(ns) {

	ns.ChartCircle = tm.createClass({
	    superClass: tm.app.Shape,

	    init: function(width) {
	        this.superInit(width, width);
	        this.interaction.enabled = true;
	        this.interaction.boundingType = "circle";
	        this._refresh();
	    },

	    _refresh: function () {
	        // 描画
	        var c = this.canvas;
	        c.resize(this.width, this.width);

	        // 外枠
	        c.strokeStyle   = ns.ChartCircle.IN_STROKE_COLOR;
	        var lineWidth   = 1;
	        c.lineWidth     = lineWidth;
	        c.strokeRoundRect(lineWidth/2, lineWidth/2, this.width-(lineWidth), this.width-(lineWidth), (this.width-(lineWidth))/2);

	        // グラデーション
	        var grad = tm.graphics.LinearGradient(0, 0, 0, this.width);
	        grad.addColorStop(0.0, ns.ChartCircle.BACK_GRADIENT_COLOR_TOP);
	        grad.addColorStop(0.5, ns.ChartCircle.BACK_GRADIENT_COLOR_CENTER);
	        grad.addColorStop(0.5, ns.ChartCircle.BACK_GRADIENT_COLOR_BOTTOM);
	        grad.addColorStop(1.0, ns.ChartCircle.BACK_GRADIENT_COLOR_BOTTOM);
	        c.setGradient(grad);
	        c.fillRoundRect(lineWidth, lineWidth, this.width-(lineWidth*2), this.width-(lineWidth*2), (this.width-(lineWidth*2))/2);
	    }
	});

	ns.ChartCircle.IN_STROKE_COLOR  = "rgba(20, 80, 180, 1.0)";
	ns.ChartCircle.BACK_GRADIENT_COLOR_TOP    = "rgba(120, 160, 245, 1.0)";
	ns.ChartCircle.BACK_GRADIENT_COLOR_CENTER = "rgba(55, 120, 220, 1.0)";
	ns.ChartCircle.BACK_GRADIENT_COLOR_BOTTOM = "rgba(35, 95, 220, 1.0)";

})(game);