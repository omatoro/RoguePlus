/**
 * タイマー
 */
(function(ns) {

    ns.ProgressBar = tm.createClass({
        superClass: tm.app.Shape,

        init: function (width, height, barColor, backgroundColor) {
            this.superInit(width || ns.app.width - 20, height || 50);

            this.barColor = barColor || "rgb(30,117,186)";
            this.backgroundColor = backgroundColor || "gray";
            this.alpha = ns.ProgressBar.DEFAULT_ALPHA;

            // バーの長さが変わった時のエフェクトを作れる？
            this.addEventListener("incrementbar", function () {
                this.animation.fade(1.0, 250);
            });
            this.addEventListener("decrementbar", function () {
                this.animation.fade(ns.ProgressBar.DEFAULT_ALPHA, 250);
            });

            // 0から100で指定
            this.barLength = 100;

            this._refresh();
        },

        setBarColor: function (color) {
            this.barColor = color;
            this._refresh();
            return this;
        },

        setBackgroundColor: function (color) {
            this.backgroundColor = color;
            this._refresh();
            return this;
        },

        setBarLength: function (length) {
            if (length < 0)   { length = 0; }
            if (100 < length) { length = 100; }

            // 実際の長さを求めて格納
            this.barLength = ((this.width-8) / 100) * length;
            this._refresh();
            return this;
        },

        _refresh: function () {
            // バーの底を表示
            var c = this.canvas;
            c.resize(this.width, this.height);
            c.fillStyle = this.backgroundColor;
            c.fillRoundRect(2, 2, this.width-4, this.height-4, 10);


            // バーを表示(長さが0の場合は以下処理はしない)
            if (0 < this.barLength) {
                c.fillStyle = this.barColor;
                c.fillRoundRect(4, 5, this.barLength, this.height-8, 8);

                var grad = tm.graphics.LinearGradient(0, 0, 0, this.height);

                grad.addColorStop(0.0,  "rgba(255,255,255,0.9)");
                grad.addColorStop(0.5,  "rgba(255,255,255,0.5)");
                grad.addColorStop(0.51, "rgba(255,255,255,0.2)");
                grad.addColorStop(1.0,  "rgba(255,255,255,0.0)");
                c.setGradient(grad);
                c.fillRoundRect(4, 4, this.barLength, this.height-8, 8);
            }

            // バーの枠線
            c.strokeStyle   = "rgba(200,200,200,255)";
            c.lineWidth     = 2;
            c.strokeRoundRect(2, 2, this.width-4, this.height-4, 10);
        }
    });

    ns.ProgressBar.DEFAULT_ALPHA = 1.0;

})(game);