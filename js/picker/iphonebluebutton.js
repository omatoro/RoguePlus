/**
 * imitate Glossy Button 
 */
(function(ns) {

	ns.iPhoneBlueButton = tm.createClass({
	    superClass: tm.app.Shape,

	    init: function(width, height, text) {
	        this.superInit(width, height);

	        text  = text  || "Button";
	        this.backgroundColor = "rgba(0, 0, 0, 0.0)";
	        this.alpha = 1.0;
	        this.interaction.enabled = true;
	        this.interaction.boundingType = "rect";
	        // ラベル
	        this.label = tm.app.Label(text || "").addChildTo(this);
	        this.label.setAlign("center").setBaseline("middle");
	        
	        this._refresh();
	    },

	    _refresh: function () {
	        // 描画
	        var c = this.canvas;
	        c.resize(this.width, this.height);
	        c.fillStyle = "rgba(0,0,0,0.0)";
	        c.fillRoundRect(2, 2, this.width-4, this.height-4, 8);

	        // 外枠
	        c.strokeStyle   = ns.iPhoneBlueButton.OUT_STROKE_COLOR;
	        c.lineWidth     = 1;
	        c.strokeRoundRect(1, 1, this.width-4, this.height-4, 8);
	        c.clip();

	        c.strokeStyle   = ns.iPhoneBlueButton.IN_STROKE_COLOR
	        c.lineWidth     = 1;
	        c.strokeRoundRect(2, 2, this.width-6, this.height-6, 8);
	        c.clip();

	        var grad = tm.graphics.LinearGradient(0, 0, 0, this.height);

	        // グラデーション
	        grad.addColorStop(0.0, ns.iPhoneBlueButton.BACK_GRADIENT_COLOR_TOP);
	        grad.addColorStop(0.5, ns.iPhoneBlueButton.BACK_GRADIENT_COLOR_CENTER);
	        grad.addColorStop(0.5, ns.iPhoneBlueButton.BACK_GRADIENT_COLOR_BOTTOM);
	        grad.addColorStop(1.0, ns.iPhoneBlueButton.BACK_GRADIENT_COLOR_BOTTOM);
	        c.setGradient(grad);
	        c.fillRect(2, 2, this.width-4, this.height-4, 8);

	        // ラベルのサイズをリセット
	        this.label.setSize(this.width, this.height);
	        this.label.fontSize  = ns.iPhoneBlueButton.FONT_SIZE;
	        this.label.fillStyle = ns.iPhoneBlueButton.FONT_COLOR;
	    }
	});

	ns.iPhoneBlueButton.OUT_STROKE_COLOR = "rgba(20, 40, 100, 1.0)";
	ns.iPhoneBlueButton.IN_STROKE_COLOR  = "rgba(20, 80, 180, 1.0)";

	ns.iPhoneBlueButton.BACK_GRADIENT_COLOR_TOP    = "rgba(120, 160, 245, 1.0)";
	ns.iPhoneBlueButton.BACK_GRADIENT_COLOR_CENTER = "rgba(55, 120, 220, 1.0)";
	ns.iPhoneBlueButton.BACK_GRADIENT_COLOR_BOTTOM = "rgba(35, 95, 220, 1.0)";

	ns.iPhoneBlueButton.FONT_SIZE  = 25;
	ns.iPhoneBlueButton.FONT_COLOR = "white";

})(game);