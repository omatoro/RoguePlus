/**
 * Inertia
 */
(function(ns) {

	// 慣性を保持
	ns.Inertia = tm.createClass({
	    init : function (middlePoint) {
	        this.current = tm.geom.Vector2(0, 0);
	        this.pre1    = tm.geom.Vector2(0, 0);
	        this.pre2    = tm.geom.Vector2(0, 0);
	        this.pre3    = tm.geom.Vector2(0, 0);
	        this.inertia = tm.geom.Vector2(0, 0);

	        this.middlePoint = middlePoint || 1.2;
	        this.dynamicFriction = 1.2;
	    },

	    // 慣性値を出すためにバッファを作る
	    set : function (currentPosition) {
	        // ポジション
	        this.pre3    = this.pre2.clone();
	        this.pre2    = this.pre1.clone();
	        this.pre1    = this.current.clone();
	        this.current = currentPosition.clone();

	        // 方向ベクトル(平均値)
	        this.inertia = currentPosition.clone().sub(this.pre3).div(3);
	    },

	    middle : function (middlePoint) {
	        middlePoint = middlePoint || this.middlePoint;
	        this.inertia.x /= middlePoint;
	        this.inertia.y /= middlePoint;

	        return this.inertia;
	    },

	    // 摩擦係数を利用して移動量計算
	    getMovedInertiaLength : function (dynamicFriction) {
	        // 現在のベクトル値から摩擦係数を利用して移動量を計算
	        dynamicFriction = dynamicFriction || this.dynamicFriction;
	        this.inertia.x /= dynamicFriction;
	        this.inertia.y /= dynamicFriction;

	        return this.inertia;
	    },

	    // 慣性と目的地を考慮して移動量を計算
	    get : function (diffPosition, middlePoint) {
	        middlePoint = middlePoint || this.middlePoint;
	        if (!diffPosition) {
	            return getMovedInertiaLength();
	        }

	        var result = getMovedMiddleDirectLength(diffPosition, middlePoint);
	        getMovedInertiaLength();
	        result.x += this.inertia.x;
	        result.y += this.inertia.y;

	        return result;
	    },

	    // 慣性と目的地を考慮して移動量を計算(できるだけ良い感じに)(目的地無視)
	    getMovecInertiaMiddle : function (diffPosition, middlePoint) {
	        middlePoint = middlePoint || this.middlePoint;
	        if (!diffPosition) {
	            return getMovedInertiaLength();
	        }

	        this.inertia.x += diffPosition/10;
	        this.inertia.y += diffPosition/10;

	        this.inertia.x /= middlePoint;
	        this.inertia.y /= middlePoint;

	        return this.inertia;
	    }

	});

	// ミドルポイントを利用して目的地への移動量を計算(慣性無視)
	ns.Inertia.getMovedMiddleDirectLength = function (diffPosition, middlePoint) {
	    // 現在のベクトル値から摩擦係数を利用して移動量を計算
	    middlePoint = middlePoint || 1.2;

	    var resultLength = tm.geom.Vector2(0, 0);
	    resultLength.x = diffPosition.x / middlePoint;
	    resultLength.y = diffPosition.y / middlePoint;

	    return resultLength;
	};
})(game);