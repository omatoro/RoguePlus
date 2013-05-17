(function(ns) {

    var CHART_COLOR = "rgba(255, 255, 255, 0.2)";

    var CHART_ELEM_SIZE = 60; // pixel 点

    var LEFT_HEAD_FONT_SIZE    = 17;
    var LEFT_HEAD_FONT_STYLE   = "rgba(255, 255, 255, 1.0)";
    var LEFT_HEAD_FONT_PADDING = 50;

    var BOTTOM_HEAD_FONT_SIZE    = 17;
    var BOTTOM_HEAD_FONT_STYLE   = "rgba(255, 255, 255, 1.0)";
    var BOTTOM_HEAD_FONT_PADDING = 0;

    ns.TMChart = tm.createClass({
        superClass: tm.app.Shape,

        init: function (chart) {
            // 画面幅の元となる余白幅を先に保持
            this.topPadding    = chart.config.topPadding;
            this.leftPadding   = chart.config.leftPadding;
            this.bottomPadding = chart.config.bottomPadding;
            this.rightPadding  = chart.config.rightPadding;

            // 画面幅の元となる分割数を先に保持
            this.column = (chart.config.column < (chart.config.minColumn || 0)) ? chart.config.minColumn : chart.config.column;
            this.row    = (chart.config.row    < (chart.config.minRow || 0))    ? chart.config.minRow    : chart.config.row;

            // 初期化
            this.superInit(
                chart.config.width  || (this.column*100) + this.leftPadding + this.rightPadding,
                chart.config.height || (this.row*50)     + this.topPadding  + this.bottomPadding);
            this.canvas.clearColor(CHART_COLOR);
            // this.alpha = 0.0;

            this.interaction.enabled = true;
            this.interaction.setBoundingType("rect");

            // 引数の解析
            this._analyze(chart);

            // ラベル(縦の見出し)
            this.rowLabels = [];
            for (var i = 0; i < this.row+1; ++i) {
                var label = tm.app.Label("", LEFT_HEAD_FONT_SIZE).addChildTo(this);
                label.fillStyle = LEFT_HEAD_FONT_STYLE;
                label.setAlign("right").setBaseline("middle");
                label.x = label.x - this.width / 2 + label.width/2 + LEFT_HEAD_FONT_PADDING; // 右端に寄せる

                this.rowLabels.push(label);
            }

            // ラベル(横の見出し)
            this.columnLabels = [];
            for (var i = 0; i < this.column; ++i) {
                var label = tm.app.Label("aa", BOTTOM_HEAD_FONT_SIZE).addChildTo(this);
                label.fillStyle = BOTTOM_HEAD_FONT_STYLE;
                label.setAlign("middle").setBaseline("middle");
                label.y = label.y + this.height/2 - label.height/2 + BOTTOM_HEAD_FONT_PADDING;

                this.columnLabels.push(label);
            }

            this._drawGrid(
                this.column,
                this.row);

            this._drawChart();


        },

        // スクロールを実装するので、中心座標をコンポジション先クラスで計算するのは面倒
        setPositionTopLeft: function (x, y) {
            // TMChart座標: center
            var centerX = this.width/2 + x;
            var centerY = this.height/2 + y;
            this.position.set(centerX, centerY);

            // このクラスをスクロールするように拡張
            var scrollConfig = {
                vertical:     false,    // 垂直方向スクロール
                horizon:      true,     // 水平方向スクロール
                limitTop:     centerY,
                limitBottom:  centerY + 500,
                limitLeft:    ns.SCREEN_WIDTH - x - this.width/2,
                limitRight:   centerX
            }
            this.extendScroll = ns.ExtendScroll(this, scrollConfig);
        },
        setPositionBottomLeft: function (x, y) {
            // TMChart座標: center
            var centerX = this.width/2 + x;
            var centerY = y - this.height;
            this.position.set(centerX, centerY);
        },
        setPositionCenterLeft: function (x, y) {
            // TMChart座標: center
            var centerX = this.width/2 + x;
            var centerY = y;
            this.position.set(centerX, centerY);
        },

        update: function(app) {
            // スクロール処理
            this.extendScroll.update(app);
        },

        //---------------------------------------------------------------------------
        //---------------------------------------------------------------------------
        //---------------------------------------------------------------------------
        //---------------------------------------------------------------------------

        _analyze: function (data) {
            // 設定データ
            if (data.config) {
                this.config = data.config;
            }
            // 表データ
            if (data.data) {
                this.data = data.data;
            }

            // データの最大値を取得
            if (this.config.maxData) {
                this.maxChart = this.config.maxData;
            }
            else {
                this.maxChart = Number.MIN_VALUE;
                for (var i = 0; i < this.data.chart.length; ++i) {
                    for (var j = 0; j < this.data.chart[i].length; ++j) {
                        if (this.maxChart < this.data.chart[i][j]) {
                            this.maxChart = this.data.chart[i][j];
                        }
                    }
                }
            }

            // ピクセルあたりのチャートデータ単位を取得
            var height = this.height - this.topPadding  - this.bottomPadding;
            this.unit = this.maxChart / height;
        },

        // チャートの下地
        _drawGrid: function (column, row) {
            // 下地を描く面の大きさを計算
            var width  = this.width  - this.leftPadding - this.rightPadding;
            var height = this.height - this.topPadding  - this.bottomPadding;

            // 一つのセルの大きさ
            this.cellWidth  = width  / column;
            this.cellHeight = height / row;

            // グリッドのスタイル
            this.canvas.lineWidth   = this.config.gridWidth || 1;
            this.canvas.strokeStyle = this.config.gridStyle || "black";

            // 描画(縦線)(TMChart座標)
            var halfWidth  = width/2;
            var halfHeight = height/2;
            for (var i = 0; i <= column; ++i) {
                var lineX = i*(this.cellWidth) + this.leftPadding;
                this.canvas.drawLine(lineX, this.topPadding, lineX, this.height - this.bottomPadding);
            }

            // 描画(横線)(TMChart座標)
            for (var i = 0; i <= row; ++i) {
                var lineY = i*(this.cellHeight) + this.topPadding;
                this.canvas.drawLine(this.leftPadding, lineY, this.width - this.rightPadding, lineY);
            }
        },

        // チャートの描画
        _drawChart: function () {
            var height = this.height - this.topPadding  - this.bottomPadding;

            // チャートの折れ線部分の描画
            if (this.config.line) {
                for (var i = 0; i < this.data.chart.length; ++i) {
                    // 描画
                    this._drawLinesCanvas(this.data.chart[i]);
                }
            }

            // チャートの点部分の描画
            for (var i = 0; i < this.data.chart.length; ++i) {
                // 描画するチャートの数を取得
                var chartNum = (this.data.chart[i].length < this.column) ? this.data.chart[i].length : this.column;
                for (var j = 0; j < chartNum; ++j) {
                    // 描画する
                    var lineX = j*(this.cellWidth) + this.leftPadding + this.cellWidth/2; // 半分ずらして描画
                    var lineY = this.height - this.bottomPadding - (this.data.chart[i][j] / this.unit);
                    this._drawPointCanvas(lineX, lineY, CHART_ELEM_SIZE, this.data.baloon[i][j] || this.data.chart[i][j]);
                }
            }

            // チャートの左側の見出しを描画(グリッド描画と処理がかぶるけど、分かりやすいように分離)
            this._drawLeftHead();

            // チャートの下側の見出しを描画
            this._drawBottomHead();
        },

        // 折れ線を実際に描く手段を決定する
        _drawLinesCanvas: function (chartData, width, style) {
            // 描画するチャートの数を取得
            var chartNum = (chartData.length < this.column) ? chartData.length : this.column;

            // 描画のパス作成開始
            this.canvas.lineWidth   = width || this.config.lineChartWidth || 3;
            this.canvas.strokeStyle = style || this.config.lineChartStyle || "red";
            this.canvas.beginPath();

            for (var i = 0; i < chartNum; ++i) {
                // 現在のiが指している座標を取得
                var lineX = i*(this.cellWidth) + this.leftPadding + this.cellWidth/2; // 半分ずらして描画
                var lineY = this.height - this.bottomPadding - (chartData[i] / this.unit);

                // 描画
                this.canvas.lineTo(lineX, lineY);
            }
            // 描画終了
            this.canvas.stroke();
        },

        // 点を実際に描く手段を決定する
        _drawPointCanvas: function (x, y, width, baloonText) {
            switch (this.config.type) {
                case "circle":
                    // (TMChart座標: center)
                    var circle = ns.ChartCircle(width);
                    circle.position.set(x - this.width/2, y - this.height/2);
                    this.addChild(circle);
                    break;
                case "ring":
                    // (TMChart座標: center)
                    var ring = ns.ChartRing(width, baloonText);
                    ring.effectPositionSet(
                        x - this.width/2,                   // スタート位置
                        this.height/2 - this.bottomPadding, // スタート位置
                        x - this.width/2,                   // 終了位置
                        y - this.height/2);                 // 終了位置
                    this.addChild(ring);
                    break;
                case "rect":
                    break;
            }
        },

        // 実際にチャートの左側の見出しを描画する手段を決定
        _drawLeftHead: function () {
            for (var i = 0; i <= this.row; ++i) {
                // 描画内容
                if (this.config.isLeftHead) {
                    var data = this.data.leftHead[i];
                }
                else {
                    var data = (this.maxChart * i) / this.row;
                }

                // 描画(TMChart座標: center)
                var lineY = (this.row - i)*(this.cellHeight) + this.topPadding - this.height/2;
                this.rowLabels[i].text = data;
                this.rowLabels[i].y = lineY;
            }
        },

        // 実際にチャートの左側の見出しを描画する手段を決定
        _drawBottomHead: function () {
            for (var i = 0; i < this.column; ++i) {
                // 描画内容
                var data = this.data.bottomHead[i];

                // 描画(TMChart座標: center)
                var lineX = i*(this.cellWidth) + this.leftPadding + this.cellWidth/2 - this.width/2 + this.columnLabels[i].width/2;
                this.columnLabels[i].text = data || " ";
                this.columnLabels[i].x = lineX;
            }
        },
    });

})(game);