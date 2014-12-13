/**
 * TitleScene
 */
tm.define("TitleScene", {
    superClass : "tm.scene.TitleScene",

    init : function() {
        this.superInit({
            title :  "RoguePlus",
            width :  game.SCREEN_WIDTH,
            height : game.SCREEN_HEIGHT
        });

        this.onpointingstart = function(e) {
            // シーンの切り替え
            var loadingScene = game.EffectLoadingScene({
                width:        e.app.width,
                height:       e.app.height,
                assets:       MAIN_ASSET,
                nextScene:    game.MainScene,
            });
            e.app.replaceScene(loadingScene);
        };
    }
});
