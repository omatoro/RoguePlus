/*
 * Extend Scroll
 * コンポジション先のクラスを直接拡張する
 */
(function(ns) {

	ns.ExtendScroll = tm.createClass({

	    init: function(conposition, config) {
	    	var scrollScreen  = conposition;
	        this.scrollScreen = scrollScreen;

	        var scrollScreenPosition  = conposition.position.clone();
	        this.scrollScreenPosition = scrollScreenPosition

	        // スクロールする方向を決める
	        this.vertical = config.vertical;
	        this.horizon  = config.horizon;

	        // スクロールの限界
	        this.limitLeft   = config.limitLeft    || 0;
	        this.limitRight  = config.limitRight   || 0;
	        this.limitTop    = config.limitTop     || 0;
	        this.limitBottom = config.limitBottom  || 0;

	        // 画面より小さい場合はスクロール機能を切る(直接引数のオブジェクトを変更するので注意)
	        if (!(this.limitLeft + scrollScreen.width/2 > ns.SCREEN_WIDTH/2 &&
	        		this.limitRight + scrollScreen.width/2 > ns.SCREEN_WIDTH/2)) {
	        	this.horizon = false;
	        	config.horizon = false;
	        }
	        if (!(this.limitTop + scrollScreen.height/2 > ns.SCREEN_HEIGHT/2 &&
	        		this.limitRight + scrollScreen.height/2 > ns.SCREEN_HEIGHT/2)) {
	        	this.vertical = false;
	        	config.vertical = false;
	        }

	        var scrollEndPosition  = tm.geom.Vector2(0, 0);
	        this.scrollEndPosition = scrollEndPosition;

	        // 慣性を保持する
	        var inertiaX = ns.Inertia();
	        this.inertiaX = inertiaX;

	        var inertiaY = ns.Inertia();
	        this.inertiaY = inertiaY;

	        // スクロールのオン、オフ用のtemp変数
	        this._scroll = {
	        	vertical: config.vertical,
	        	horizon:  config.horizon
	        };

	        // 機能追加
	        this.scrollScreen.addEventListener("pointingmove", function(e) {
	            var p = e.app.pointing;
	            if (p.getDrag()) {
	                // ドラッグ開始位置からの移動量を計算してメニュー位置に反映
	                
	                var movingX = 0;
	                var movingY = 0;
	                if (config.horizon)  { var movingX = p.x - p.dragStartPosition.x; }
	                if (config.vertical) { var movingY = p.y - p.dragStartPosition.y; }
	                scrollScreen.position.set(scrollScreenPosition.x + movingX, scrollScreenPosition.y + movingY);
	                
	                // 現在のスクロール位置を保存
	                scrollEndPosition.x = movingX;
	                scrollEndPosition.y = movingY;
	                
	                // 毎フレームの移動量を保存(慣性に使用)
	                inertiaX.set(tm.geom.Vector2(movingX, movingY));
	                inertiaY.set(tm.geom.Vector2(0, movingY));
	            }
	        });
	        this.scrollScreen.addEventListener("pointingend", function() {
	            // ドラッグ終了時に現在位置を保持
	            if (config.horizon)  { scrollScreenPosition.x += scrollEndPosition.x; }
	            if (config.vertical) { scrollScreenPosition.y += scrollEndPosition.y; }
	        });
	        this.scrollScreen.addEventListener("pointingstart", function() {
	            // 要素選択時の自動移動を終了
	            //scrollScreen.tweener.clear();

	            // ドラッグ中はメニュー移動処理を行うが、ドラッグ終了時に移動枠の限度まで戻す(iPhoneのプルダウンを参考)
	            var limitRightPosition  = config.limitRight;
	            var limitLeftPosition   = config.limitLeft;
	            if (config.horizon) {
		            if (scrollScreenPosition.x > limitRightPosition) {
		                scrollScreenPosition.x = limitRightPosition;
		                scrollScreen.position.set(scrollScreenPosition.x, scrollScreenPosition.y);
		            }
		            else if (scrollScreenPosition.x < limitLeftPosition) {
		                scrollScreenPosition.x = limitLeftPosition;
		                scrollScreen.position.set(scrollScreenPosition.x, scrollScreenPosition.y);
		            }
		        }
	            var limitBottomPosition  = config.limitBottom;
	            var limitTopPosition     = config.limitTop;
	            if (config.vertical) {
		            if (scrollScreenPosition.y > limitBottomPosition) {
		                scrollScreenPosition.y = limitBottomPosition;
		                scrollScreen.position.set(scrollScreenPosition.x, scrollScreenPosition.y);
		            }
		            else if (scrollScreenPosition.y < limitTopPosition) {
		                scrollScreenPosition.y = limitTopPosition;
		                scrollScreen.position.set(scrollScreenPosition.x, scrollScreenPosition.y);
		            }
		        }
	            
	            // ドラッグ時の慣性を初期化する
	            inertiaX.init();
	            inertiaY.init();
	        });
	    },

        offScroll: function () {
        	this._scroll.horizon  = this.horizon;
        	this._scroll.vertical = this.vertical;
        	this.horizon  = false;
        	this.vertical = false;
        },
        onScroll: function () {
        	config.horizon  = this._scroll.horizon;
        	config.vertical = this._scroll.vertical;
        },

	    update: function (app) {
	        // 慣性移動(ドラッグ中でない場合のみ行う) & 限界まで移動したら戻す
	        if (!app.pointing.getPointingEnd() && !app.pointing.getDrag()) {
	        	if (this.horizon) {
		            var limitRightPosition  = this.limitRight;
		            var limitLeftPosition   = this.limitLeft;
		            // 慣性移動中に右方向の移動上限に達したら、上限まで戻す
		            if (this.scrollScreen.position.x > limitRightPosition) {
		                this.scrollScreen.position.x += this.inertiaX.getMovecInertiaMiddle(limitRightPosition - this.scrollScreen.position.x, 1.7).x;
		                this.scrollScreenPosition.x  = this.scrollScreen.position.x;
		                this.scrollEndPosition.x     = this.scrollScreen.position.x;
		            }
		            // 慣性移動中に左方向の移動上限に達したら、上限まで戻す
		            else if (this.scrollScreen.position.x < limitLeftPosition) {
		                this.scrollScreen.position.x += this.inertiaX.getMovecInertiaMiddle(limitLeftPosition - this.scrollScreen.position.x, 1.7).x;
		                this.scrollScreenPosition.x  = this.scrollScreen.position.x;
		                this.scrollEndPosition.x     = this.scrollScreen.position.x;
		            }
		            // 慣性移動
		            else {
		                this.scrollScreen.position.x += this.inertiaX.middle().x;
		                this.scrollScreenPosition.x  = this.scrollScreen.position.x;
		                this.scrollEndPosition.x     = this.scrollScreen.position.x;
		            }
		        }

		        if (this.vertical) {
		            var limitBottomPosition  = this.limitBottom;
		            var limitTopPosition     = this.limitTop;
		            // 慣性移動中に上方向の移動上限に達したら、上限まで戻す
		            if (this.scrollScreen.position.y > limitBottomPosition) {
		                this.scrollScreen.position.y += this.inertiaY.getMovecInertiaMiddle(limitBottomPosition - this.scrollScreen.position.y, 1.7).y;
		                this.scrollScreenPosition.y  = this.scrollScreen.position.y;
		                this.scrollEndPosition.y     = this.scrollScreen.position.y;
		            }
		            // 慣性移動中に下方向の移動上限に達したら、上限まで戻す
		            else if (this.scrollScreen.position.y < limitTopPosition) {
		                this.scrollScreen.position.y += this.inertiaY.getMovecInertiaMiddle(limitTopPosition - this.scrollScreen.position.y, 1.7).y;
		                this.scrollScreenPosition.y  = this.scrollScreen.position.y;
		                this.scrollEndPosition.y     = this.scrollScreen.position.y;
		            }
		            // 慣性移動
		            else {
		                this.scrollScreen.position.y += this.inertiaY.middle().y;
		                this.scrollScreenPosition.y  = this.scrollScreen.position.y;
		                this.scrollEndPosition.y     = this.scrollScreen.position.y;
		            }
		        }
	        }
	    }
	});

})(game);