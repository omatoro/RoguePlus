/**
 * タイトル画面
 */
(function(ns) {

    ns.TitleScene = tm.createClass({
        superClass : tm.app.TitleScene,

        init : function() {
            this.superInit({
                title :  "RogueLike",
                width :  ns.SCREEN_WIDTH,
                height : ns.SCREEN_HEIGHT
            });

            this.addEventListener("pointingend", function(e) {
                e.app.replaceScene(ns.MainScene());
            });
        }
    });

})(game);