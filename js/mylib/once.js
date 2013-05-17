/**
 * 一度だけ実行できる関数を作るクラス
 *
 * ■使い方
 * once.run(
 *      true,
 *      関数リテラル,
 *      第二引数の関数に渡す引数郡);
 *
 * 第一引数がtrueになった瞬間のみ、第二引数の処理を行う。
 * 処理を一度行った後は、第一引数がtrueであっても処理を行わない。
 */
(function(ns) {

    ns.Once = tm.createClass({
        once_flag : true,

        run : function (flag, func) {
            if (flag           === true
            &&  this.once_flag === true) {
                var temp_arguments = [];
                for (var i = 2; i < arguments.length; ++i) {
                    temp_arguments[i - 2] = arguments[i];
                }
                func.apply(null, temp_arguments);
                this.once_flag = false;
            }
        },

        call : function (flag, funcThis, func) {
            if (flag           === true
            &&  this.once_flag === true) {
                var temp_arguments = [];
                for (var i = 2; i < arguments.length; ++i) {
                    temp_arguments[i - 2] = arguments[i];
                }
                func.apply(funcThis, temp_arguments);
                this.once_flag = false;
            }
        }
    });

})(game);