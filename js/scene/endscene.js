/**
 * EndScene
 */
(function(ns) {

    var RESULT_PARAM = {
            score: 256,
            msg:      "【Rogue】",
            hashtags: ["omatoro", "Rogue", "tmlib"],
            url:      "http://rogue.testcording.com/",
            width:    ns.SCREEN_WIDTH,
            height:   ns.SCREEN_HEIGHT,
            related:  "tmlib.js javascript testcording",
    };

    ns.EndScene = tm.createClass({

        superClass : tm.app.ResultScene,

        // タイトル移動へのボタン
        title_button : {},

        init : function(stairsNum, playerLevel, isClear) {
            if (isClear) {
                RESULT_PARAM.score = "全" + (stairsNum-1) + "階制覇しました";
            }
            else {
                RESULT_PARAM.score = stairsNum + "階で死亡しました";
            }
            this.superInit(RESULT_PARAM);

            // this.gameData = {
            //     back: backNum,
            //     speed: speed,
            //     speedName: speedName,
            //     quest: questNumber
            // }

            // // ローカルストレージからデータを取得
            // var loadLocalStorage = localStorage["WEBack"];
            // if (loadLocalStorage) {
            //     loadLocalStorage = JSON.parse(loadLocalStorage);
            // }
            // else {
            //     loadLocalStorage = {
            //         data: []
            //     };
            // }

            // var date = new Date();
            // var alldate = date.format("Y/m/d");
            // var year    = date.format("Y");
            // var month   = date.format("m");
            // var day     = date.format("d");

            // memorizeData = {
            //     date: {
            //         all: alldate,
            //         year: year,
            //         month: month,
            //         day: day,
            //     },
            //     score: score,
            //     questNumber: questNumber,
            //     back: backNum,
            //     speed: speedName
            // };

            // loadLocalStorage.data.push(memorizeData);
            // localStorage["WEBack"] = JSON.stringify(loadLocalStorage);
        },

        update : function () {
        },

        // Backボタンを押したら、onpointingstart->インスタンス.dispatchEventにより
        // 以下onnextsceneイベントが実行される
        onnextscene : function () {
            ns.app.replaceScene(ns.TitleScene());
            ns.MainScene.STAGE_NUMBER = 1;
        },
    });

})(game);