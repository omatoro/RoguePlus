/*
 * Chart Baloon
 */
(function(ns) {

	var FONT_SIZE    = 20;
	var FONT_STYLE   = "rgba(20, 20, 20, 0.0)";
	var FONT_PADDING = 0;
	var FONT_LEFT_PADDING = 20;

	ns.ChartBaloon = tm.createClass({
	    superClass: tm.app.Shape,

	    init: function(text) {
	    	// 文字を先に作成(幅を取得するため)
	    	var label = tm.app.Label(text || "demo", FONT_SIZE);
            label.fillStyle = FONT_STYLE;
            label.setAlign("left").setBaseline("middle");
            this.label = label;
            this.name = "baloon"; // child検索用

            // 文字列の横幅が取得できないので、仮に正確ではないが計算する
            var width = text.length * 15;

            // 初期化
	        this.superInit(width + (FONT_LEFT_PADDING*2), label.height + (FONT_PADDING*2));

	        // 文字列の場所を決める
            label.x = label.x - this.width/2 + FONT_LEFT_PADDING; // 左端に寄せる

	        this.interaction.enabled = true;
	        this.interaction.boundingType = "rect";
	        this.alpha = 0;
	        this.backgroundColor = "rgba(0, 0, 0, 0.0)";

	        // 文字を追加
	        this.addChild(label);
	        this._refresh();
	    },

	    effectPositionSet: function (x, y) {
	    	x += this.width/2;  // ずらさないと点とかぶるため
	    	y -= this.height/3;

	    	this.position.set(x, y);
	    },

	    onDisplay: function () {
	    	if (!this.tweener.isPlaying) {
		    	this.tweener.clear();
	            this.tweener.
	                to({"alpha": 1000}, 100);
            }
	    },

	    offDisplay: function () {
	    	if (this.alpha > 0 && !this.tweener.isPlaying) {
	    		this.tweener.clear();
	            this.tweener.
	                to({"alpha": 0}, 100);
            }
	    },

	    update: function () {
	        if (this.tweener.isPlaying) {
	            this._refresh();
	        }
	    },

	    _refresh: function () {
	        // 描画
	        var c = this.canvas;
	        c.resize(this.width, this.width);

	        // 外枠
	        c.strokeStyle   = tm.graphics.Color.createStyleRGBA(55, 120, 220, this.alpha/1000);
	        var lineWidth   = 1;
	        c.lineWidth     = lineWidth;
	        c.strokeRoundRect(lineWidth/2, lineWidth/2, this.width-(lineWidth), this.width-(lineWidth), 5);

	        // テキスト描画部分
	        c.fillStyle = tm.graphics.Color.createStyleRGBA(255, 255, 255, this.alpha*0.7/1000);
	        c.lineWidth = 0;
	        c.fillRoundRect(lineWidth, lineWidth, this.width-(lineWidth*2), this.width-(lineWidth*2), 5);

            // ラベルのサイズをリセット
            this.label.fillStyle = tm.graphics.Color.createStyleRGBA(20, 20, 20, this.alpha/1000);
            this.label.setSize(this.width, this.height);
	    }
	});

})(game);