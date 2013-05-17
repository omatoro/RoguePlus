/**
 * MainScene
 */
(function(ns) {

    // ラベルのリスト
    var UI_DATA = {
        LABELS: {
            children: [{
                type: "Label",
                name: "stairsNum",
                x: 100,
                y: 80,
                width: ns.SCREEN_WIDTH,
                fillStyle: "white",
                text: " ",
                fontSize: 25,
                align: "right"
            },{
                type: "Label",
                name: "statusLevel",
                x: 130,
                y: 80,
                width: ns.SCREEN_WIDTH,
                fillStyle: "white",
                text: " ",
                fontSize: 25,
                align: "left"
            },{
                type: "Label",
                name: "statusHP",
                x: 230,
                y: 80,
                width: ns.SCREEN_WIDTH,
                fillStyle: "white",
                text: " ",
                fontSize: 25,
                align: "left"
            },{
                type: "Label",
                name: "statusMP",
                x: 430,
                y: 80,
                width: ns.SCREEN_WIDTH,
                fillStyle: "white",
                text: " ",
                fontSize: 25,
                align: "left"
            }]
        }
    };

    ns.MainScene = tm.createClass({
        superClass : tm.app.Scene,

        init : function(continuePlayer, continuePad) {
            this.superInit();

            // コントローラーパッド
            var pad = continuePad || tm.controller.Pad();
            this.pad = pad;
            pad.position.set(80, ns.SCREEN_HEIGHT - 80);

            // プレイヤー
            var player = continuePlayer || ns.Player(pad);
            this.player = player;
            player.setInputPad(pad);
            player.position.set(ns.SCREEN_WIDTH/2, ns.SCREEN_HEIGHT/2);

            // マップ
            var map = ns.Map(pad);
            this.map = map;
            // 取得した位置をスクリーンの中心になるようにマップの中心座標を設定する
            var safePosition = map.getRandomSafeMapChipPosition(); // 場所を取得
            safePosition = map.mapLeftTopToMapCenter(
                safePosition.x * map.mapChipWidth  + map.mapChipWidth/2,
                safePosition.y * map.mapChipHeight);
            // マップの中心位置を計算する(safePositionがスクリーンの中心に来るように)
            safePosition.x = ns.SCREEN_WIDTH/2  - safePosition.x;
            safePosition.y = ns.SCREEN_HEIGHT/2 - safePosition.y;
            map.setStairs();
            map.initMapPosition(safePosition);
            map.setPlayer(safePosition);

            // アイテム
            var itemList   = ns.ItemList();
            var itemGroup  = tm.app.CanvasElement();
            this.itemGroup = itemGroup;
            map.setItemGroup(itemGroup);

            // 敵
            var enemyGroup = tm.app.CanvasElement();
            this.enemyGroup = enemyGroup;
            this.stage = ns.StageManager(ns.MainScene.STAGE_NUMBER, enemyGroup, player, map);


            // 敵をマップに追加
            map.setEnemyGroup(enemyGroup);

            // 攻撃時のエフェクト
            var ss = tm.app.SpriteSheet({
                image: "slash",
                frame: {
                    width:  65,
                    height: 65,
                    count: 8
                },
                animations: {
                    "slash": [0, 8]
                }
            });
            var slash = tm.app.AnimationSprite(120, 120, ss)
            // this.slash = slash;
            slash.position.set(ns.SCREEN_WIDTH/2 + 10, ns.SCREEN_HEIGHT/2 + 10);

            // 攻撃ボタン
            var attackButton = tm.app.GlossyButton(200, 160, "green", "攻撃");
            attackButton.position.set(ns.SCREEN_WIDTH-50-50, ns.SCREEN_HEIGHT-30-50);
            this.attackButton = attackButton;
            var attackTiming = ns.Timing(150);
            this.attackTiming = attackTiming;

            attackButton.addEventListener("pointingmove", function(e) {
                // タイミングが来たら攻撃可能
                attackTiming.resetLimit(player.getAttackSpeed(e.app.fps));
                if (attackTiming.is() === false) {
                    return ;
                }
                attackTiming.reset();

                // 攻撃の方向を調べる
                var attackAngle = player.attack();
                var attackVelocity = tm.geom.Vector2(0,0).setDegree(attackAngle, 1);
                attackVelocity.y *= -1;
                // 攻撃の場所を計算する()画面上
                var distanse = 50 + (player.getDistanse() * 20);
                var attackScreenPosition = player.position.clone().add(tm.geom.Vector2.mul(attackVelocity, distanse));

                // 攻撃時のアニメーション
                slash.position.set(attackScreenPosition.x, attackScreenPosition.y);
                slash.gotoAndPlay("slash");

                // 攻撃するポイントを作成
                var attackMapPosition = map.playerPosition.clone().add(tm.geom.Vector2.mul(attackVelocity, distanse));
                attackMapPosition = map.mapLeftTopToMapCenter(attackMapPosition.x, attackMapPosition.y-20);
                var attackElement = tm.app.Object2D();
                attackElement.radius = 20;
                attackElement.position.set(attackMapPosition.x, attackMapPosition.y);

                // 攻撃が当たっているか調べる
                for (var i = 0; i < enemyGroup.children.length; ++i) {
                    var enemy = enemyGroup.children[i];
                    var position = enemy.position.clone();
                    if (enemy.isHitElementCircle(attackElement)) {
                        // ダメージ数を計算
                        var attack = player.getAttackPoint();
                        var damage = enemy.damage(attack);

                        // ダメージ数を表示
                        var damageEffect = ns.DamagedNumber(damage);

                        // 経験値取得
                        var exp = enemy.getExp();
                        player.addExp(exp);

                        // アイテムドロップ
                        var itemData = itemList.get(enemy.getDropItem());
                        if (itemData !== null) {
                            var dropItem = ns.DropItem(itemData);
                            dropItem.position.set(enemy.x, enemy.y);
                            map.addItem(dropItem);
                        }

                        // 表示場所を設定
                        var damagePosition = map.mapCenterToScreenTopLeft(enemy.x, enemy.y);
                        damageEffect.effectPositionSet(damagePosition.x + 10, damagePosition.y + 5);
                        e.app.currentScene.addChild(damageEffect);
                    }
                }
            });

            // ステータス画面への遷移ボタン
            var statusButton = tm.app.GlossyButton(150, 60, "blue", "ステータス");
            statusButton.position.set(ns.SCREEN_WIDTH/2, ns.SCREEN_HEIGHT-30-50);
            this.statusButton = statusButton;
            statusButton.addEventListener("pointingend", function(e) {
                tm.sound.SoundManager.get("openstatus").play();
                e.app.pushScene(ns.StatusScene(player));
            });

            // 画面に追加
            this.addChild(map);
            this.addChild(pad);
            this.addChild(player);
            this.addChild(slash);
            this.addChild(attackButton);
            this.addChild(statusButton);

            // サウンド：BGM
            this.bgm = tm.sound.SoundManager.get("dungeon");
            this.bgm.loop = true;
            this.bgm.play();

            // ステータス表示
            this.fromJSON(UI_DATA.LABELS);
        },

        screenLeftTopToCenter: function (x, y) {
            var result = tm.geom.Vector2(x - ns.SCREEN_WIDTH/2, y - ns.SCREEN_HEIGHT/2);
            return result;
        },
        screenCenterToLeftTop: function (x, y) {
            var result = tm.geom.Vector2(x + ns.SCREEN_WIDTH/2, y + ns.SCREEN_HEIGHT/2);
            return result;
        },

        drawStatus: function () {
            this.stairsNum.text   = ns.MainScene.STAGE_NUMBER + "階";
            this.statusLevel.text = "Lv." + this.player.getLevel();
            this.statusHP.text    = "HP " + this.player.getCurrentHP() + "/" + this.player.getMaxHP();
            // this.statusMP.text    = "MP " + this.player.getCurrentMP() + "/" + this.player.getMaxMP();
        },

        update : function(app) {
            // 攻撃のアクティブバーのカウントアップ
            this.attackTiming.update()

            // ステータスの描画
            this.drawStatus();

            // 次のステージに進むフラグがたったらマップ更新
            if (this.map.isNextStage()) {
                ++ns.MainScene.STAGE_NUMBER;
                this.bgm.stop();
                tm.sound.SoundManager.get("downStairs").play();
                app.replaceScene(ns.MainScene(this.player, this.pad));
            }

            // ゲームオーバーフラグがたったらゲーム終了
            if (this.player.isGameOver()) {
                this.bgm.stop();
                app.replaceScene(ns.EndScene(ns.MainScene.STAGE_NUMBER, this.player.getLevel(), false));
            }

            // ゲームクリアフラグがたったらゲーム終了
            if (this.stage.isGameClear()) {
                this.bgm.stop();
                tm.sound.SoundManager.get("levelup").play();
                app.replaceScene(ns.EndScene(ns.MainScene.STAGE_NUMBER, this.player.getLevel(), true));
            }
        }
    });

    ns.MainScene.STAGE_NUMBER = 1;

})(game);