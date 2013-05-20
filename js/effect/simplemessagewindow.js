/*
 * SimpleMessageWindow
 */
(function(ns) {

	var FONT_SIZE    = 15;
	var FONT_STYLE   = "rgba(255, 255, 255, 0.0)";
	var FONT_PADDING = 0;
	var FONT_LEFT_PADDING = 0;

	var WINDOW_WIDTH = 180;
	var WINDOW_HEIGHT = 150;
	var WINDOW_PADDING = 20;

	ns.SimpleMessageWindow = tm.createClass({
	    superClass: tm.app.Shape,

	    init: function(text, colorR, colorG, colorB) {
	    	// 文字を先に作成(幅を取得するため)
	    	var label = tm.app.Label(text + "", FONT_SIZE);
            label.fillStyle = FONT_STYLE;
            label.setAlign("left").setBaseline("middle");
            label.fontFamily = "'Consolas', 'Monaco', 'ＭＳ ゴシック'";
            this.label = label;

            // 初期化
	        this.superInit(WINDOW_WIDTH, WINDOW_HEIGHT);

	        // 色
	        this.colorR = colorR || 255;
	        this.colorG = colorG || 255;
	        this.colorB = colorB || 255;

	        // フォントの描画場所
            label.x = 0;
            label.y = -5;

	        this.interaction.enabled = false;
	        this.alpha = 1000;
	        this.backgroundColor = "rgba(0, 0, 0, 0.0)";

	        // だんだん消えていく
            this.timeline.
                to({"alpha": -1}, 2000, 3500);

	        // 文字を追加
	        this.addChild(label);
	        this._refresh();
	    },

	    moveby: function (deltax, deltay, fn) {
	    	this.timeline
                .by({"x": deltax, "y": deltay}, 300, 0)
                .call(fn, 0);
	    },

	    update: function () {
            this._refresh();

	        if (this.alpha <= 0) {
	        	this.remove();
	        }
	    },

	    // 改行処理をphi_jp氏のサンプルからとりあえずそのまま入れる
		fillTextLine: function(context, text, x, y) {
			var textList = text.split('\n');
			var lineHeight = context.measureText("あ").width;
			textList.forEach(function(text, i) {
				context.fillText(text, x, y+lineHeight*i);
			});
		},

	    _refresh: function () {
	        // 描画
	        var c = this.canvas;
	        c.resize(this.width, this.width);
	        var lineWidth   = 0;

	        // テキスト描画部分
	        c.fillStyle = tm.graphics.Color.createStyleRGBA(this.colorR, this.colorG, this.colorB, this.alpha*0.5/1000);
	        c.lineWidth = 0;
	        c.fillRoundRect(lineWidth, lineWidth, this.width-(lineWidth*2), this.height-(lineWidth*2), 5);

            // ラベルのサイズをリセット
            this.label.fillStyle = tm.graphics.Color.createStyleRGBA(20, 20, 20, this.alpha/1000);
            this.label.setSize(this.width, this.height);
	    }
	});

})(game);