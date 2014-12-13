/**
 * EffectLoadingScene
 */
(function(ns) {
    
    var DEFAULT_PARAM = {
        width: 465,
        height: 465,
    };
    
    ns.EffectLoadingScene = tm.createClass({
        superClass: tm.app.Scene,
        
        init: function(param) {
            this.superInit();
            
            param = {}.$extend(DEFAULT_PARAM, param);
            
            // 既にロードしたオブジェクト数
            this.loadedCounter = 0;

            // これからロードするオブジェクト数
            var planLoadNum = 0;
            for (var i in param.assets) {
                ++planLoadNum;
            }
            this.planLoadNum = planLoadNum;
            
            // プログレスバー
            var bar = ns.ProgressBar(ns.SCREEN_WIDTH-250, 25);
            bar.setPosition(ns.SCREEN_WIDTH/2 - 50, ns.SCREEN_HEIGHT - 90);
            bar.setBarLength(0);
            this.bar = bar;
            this.addChild(bar);


            // ロード中のエフェクト
            var temp = tm.asset.Manager.get("loading");
            var ss = tm.asset.SpriteSheet({
                image: "loading",
                frame: {
                    width:  128,
                    height: 128,
                    count:  30
                },
                animations: {
                    "load": [0, 30, "load"]
                }
            });
            var loading = tm.display.AnimationSprite(ss, 256, 256);
            loading.position.set(ns.SCREEN_WIDTH - 100, ns.SCREEN_HEIGHT - 100);
            this.addChild(loading);
            loading.gotoAndPlay("load");

            this.alpha = 0.0;
            this.tweener.clear().fadeIn(100).call(function() {
                // 
                var loader = tm.asset.Loader();
                loader.load(param.assets);
                // 
                loader.onprogress = function (e) {
                    this.loadedCounter = e.progress;
                    this.bar.setBarLength(this.loadedCounter * 100);
                }.bind(this);
                // 
                loader.onload = function() {
                    this.tweener.clear().fadeOut(200).call(function() {
                        this.app.replaceScene(param.nextScene());
                    }.bind(this));
                }.bind(this);
            }.bind(this));
        },
    });
    
    
})(game);