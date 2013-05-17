/**
 * input over lap
 *
 * ■追加機能
 * getPointingEndNonDrag
 * - ドラッグでないPointingEndを取得
 * 
 * getDrag
 * - ドラッグ中かどうかを取得
 */
tm.input.Mouse.prototype.init = function(element) {
    this.element = element || window.document;
    
    this.position       = tm.geom.Vector2(0, 0);
    this.deltaPosition  = tm.geom.Vector2(0, 0);
    this.prevPosition   = tm.geom.Vector2(0, 0);
    
    //-------------------------拡張------------------------------
    this.dragStartPosition = null;
    this._isClick = false;
    this._limitOneFrame = 0;
    this._isMove = false;
    //-----------------------------------------------------------
    
    var self = this;
    this.element.addEventListener("mousemove", function(e){
        // 座標更新
        self._mousemove(e);
    });
    this.element.addEventListener("mousedown", function(e){
        self.button |= 1<<e.button;
    });
    this.element.addEventListener("mouseup", function(e){
        self.button &= ~(1<<e.button);
    });
    this.element.addEventListener("mouseover", function(e){
        // 座標更新
        self._mousemove(e);
        self.prevPosition.setObject(self.position);
    });
};

tm.input.Mouse.prototype.update = function() {
    this.last = this.press;
    
    this.press = this.button;
    
    this.down = (this.press ^ this.last) & this.press;
    this.up   = (this.press ^ this.last) & this.last;
    
    // 変化値を保存
    this.deltaPosition.setObject(this.position).sub(this.prevPosition);
    
    // 前回の座標を保存
    this.prevPosition.setObject(this.position);
    
    //-------------------------拡張------------------------------
    if (this._limitOneFrame > 0) { --this._limitOneFrame; } // 指定フレームずらして判定させるための苦肉の策
    //-----------------------------------------------------------
};

//-------------------------拡張------------------------------
tm.input.Mouse.prototype.getPointingStart = function() {
    if (this.getButtonDown("left")) {
        this.dragStartPosition = this.position.clone();
        this._isMove = true;
        return true;
    }
    return false;
};
tm.input.Mouse.prototype.getPointingEnd = function() {
    if (this.getButtonUp("left")) {
        this._isClick = false;
        this._isMove = false;
        return true;
    }
    return false;
};
tm.input.Mouse.RECOGNIZE_DRAGED_PIXEL = 3;
tm.input.Mouse.prototype.getDrag = function() {
    this.getPointingStart();
    this.getPointingEnd();
    if (this._isMove &&
        Math.abs(this.dragStartPosition.x - this.position.x) + Math.abs(this.dragStartPosition.y - this.position.y) > tm.input.Mouse.RECOGNIZE_DRAGED_PIXEL) {
        this._isClick = true;
        this._limitOneFrame = 2;
        return true;
    }
    else if (this._isClick) {
        this._limitOneFrame = 1;
        return true;
    }
    else if (this._limitOneFrame > 0) {
        return true;
    }
    else {
        return false;
    }
};
tm.input.Mouse.prototype.getPointingEndNonDrag = function() {
    return this.getPointingEnd() && !this.getDrag();
};
//-----------------------------------------------------------


//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------


tm.input.Touch.prototype.init = function(element) {
    this.element = element || window.document;
    
    this.position       = tm.geom.Vector2(0, 0);
    this.deltaPosition  = tm.geom.Vector2(0, 0);
    this.prevPosition   = tm.geom.Vector2(0, 0);
    
    //-------------------------拡張------------------------------
    this.dragStartPosition = null;
    this._isClick = false;
    this._limitOneFrame = 0;
    this._isMove = false;
    //-----------------------------------------------------------
    
    var self = this;
    this.element.addEventListener("touchstart", function(e){
        self._touchmove(e);
        self.prevPosition.setObject(self.position);
        self.touched = true;
    });
    this.element.addEventListener("touchend", function(e){
        self.touched = false;
    });
    this.element.addEventListener("touchmove", function(e){
        self._touchmove(e);
        // 画面移動を止める
        e.stop();
    });
};

tm.input.Touch.prototype.update = function() {
    this.last   = this.now;
    this.now    = Number(this.touched);
    
    this.start  = (this.now ^ this.last) & this.now;
    this.end    = (this.now ^ this.last) & this.last;
    
    // 変化値を保存
    this.deltaPosition.setObject(this.position).sub(this.prevPosition);
    
    // 前回の座標を保存
    this.prevPosition.setObject(this.position);
    
    //-------------------------拡張------------------------------
    if (this._limitOneFrame > 0) { --this._limitOneFrame; } // 指定フレームずらして判定させるための苦肉の策
    //-----------------------------------------------------------
};

//-------------------------拡張------------------------------
tm.input.Touch.prototype.getTouchStart = function() {
    if (this.start != 0) {
        this.dragStartPosition = this.position.clone();
        this._isMove = true;
        return true;
    }
    return false;
};
tm.input.Touch.prototype.getTouchEnd = function() {
    if (this.end != 0) {
        this._isClick = false;
        this._isMove = false;
        return true;
    }
    return false;
};
tm.input.Touch.prototype.getPointingStart   = tm.input.Touch.prototype.getTouchStart;
tm.input.Touch.prototype.getPointingEnd     = tm.input.Touch.prototype.getTouchEnd;

tm.input.Touch.RECOGNIZE_DRAGED_PIXEL = 3;
tm.input.Touch.prototype.getDrag = function() {
    this.getPointingStart();
    this.getPointingEnd();
    if (this._isMove &&
        Math.abs(this.dragStartPosition.x - this.position.x) + Math.abs(this.dragStartPosition.y - this.position.y) > tm.input.Mouse.RECOGNIZE_DRAGED_PIXEL) {
        this._isClick = true;
        this._limitOneFrame = 2;
        return true;
    }
    else if (this._isClick) {
        this._limitOneFrame = 1;
        return true;
    }
    else if (this._limitOneFrame > 0) {
        return true;
    }
    else {
        return false;
    }
};
tm.input.Touch.prototype.getPointingEndNonDrag = function() {
    return this.getPointingEnd() && !this.getDrag();
};
//-----------------------------------------------------------
