/**
 * Status
 */
(function(ns) {

    // ステータス画面のサイズなど
    var STATUS_WIDTH_PADDING = 25;
    var STATUS_WIDTH  = ns.SCREEN_WIDTH  - (STATUS_WIDTH_PADDING*2);
    var STATUS_HEIGHT = ns.SCREEN_HEIGHT - 100;

    var STATUS_TOP_PADDING = 50;
    var STATUS_CENTER_X = ns.SCREEN_WIDTH/2;
    var STATUS_CENTER_Y = STATUS_TOP_PADDING + STATUS_HEIGHT/2;

    var EXIT_BUTTON_PADDING = 25;
    var EXIT_BUTTON_WIDTH  = 150;
    var EXIT_BUTTON_HEIGHT = 60;
    var EXIT_BUTTON_CENTER_X = ns.SCREEN_WIDTH - STATUS_WIDTH_PADDING - (EXIT_BUTTON_WIDTH/2) - EXIT_BUTTON_PADDING;
    var EXIT_BUTTON_CENTER_Y = STATUS_TOP_PADDING + EXIT_BUTTON_HEIGHT/2 + EXIT_BUTTON_PADDING;

    // ステータス表示のラベルの定数
    var STATUS_LABEL_UP_PADDING      = - STATUS_HEIGHT/2 + (EXIT_BUTTON_PADDING + EXIT_BUTTON_HEIGHT) + EXIT_BUTTON_HEIGHT;
    var STATUS_LABEL_LEFT_PADDING    = 60;
    var STATUS_LABEL_BETWEEN_PADDING = 45;

    // ラベルのリスト
    var UI_DATA = {
        LABELS: {
            children: [{
                type: "Label",
                name: "statusLevel",
                x: STATUS_LABEL_LEFT_PADDING,
                y: STATUS_LABEL_UP_PADDING,
                width: ns.SCREEN_WIDTH,
                fillStyle: "white",
                text: " ",
                fontSize: 25,
                align: "left"
            },{
                type: "Label",
                name: "statusHP",
                x: STATUS_LABEL_LEFT_PADDING,
                y: STATUS_LABEL_UP_PADDING + (STATUS_LABEL_BETWEEN_PADDING*1),
                width: ns.SCREEN_WIDTH,
                fillStyle: "white",
                text: " ",
                fontSize: 25,
                align: "left"
            },{
                type: "Label",
                name: "statusEXP",
                x: STATUS_LABEL_LEFT_PADDING,
                y: STATUS_LABEL_UP_PADDING + (STATUS_LABEL_BETWEEN_PADDING*2),
                width: ns.SCREEN_WIDTH,
                fillStyle: "white",
                text: " ",
                fontSize: 25,
                align: "left"
            },{
                type: "Label",
                name: "statusSTR",
                x: STATUS_LABEL_LEFT_PADDING,
                y: STATUS_LABEL_UP_PADDING + (STATUS_LABEL_BETWEEN_PADDING*3),
                width: ns.SCREEN_WIDTH,
                fillStyle: "white",
                text: " ",
                fontSize: 25,
                align: "left"
            },{
                type: "Label",
                name: "statusDEF",
                x: STATUS_LABEL_LEFT_PADDING,
                y: STATUS_LABEL_UP_PADDING + (STATUS_LABEL_BETWEEN_PADDING*4),
                width: ns.SCREEN_WIDTH,
                fillStyle: "white",
                text: " ",
                fontSize: 25,
                align: "left"
            },{
                type: "Label",
                name: "statusAGI",
                x: STATUS_LABEL_LEFT_PADDING,
                y: STATUS_LABEL_UP_PADDING + (STATUS_LABEL_BETWEEN_PADDING*5),
                width: ns.SCREEN_WIDTH,
                fillStyle: "white",
                text: " ",
                fontSize: 25,
                align: "left"
            }]
        }
    };

    ns.Status = tm.createClass({
        superClass : tm.app.Shape,

        init: function(parent) {
            this.superInit(STATUS_WIDTH, STATUS_HEIGHT);
            this.setPosition(STATUS_CENTER_X, STATUS_CENTER_Y);

            this.backgroundColor = "rgba(55, 120, 220, 0.5)";
            this.alpha = 1.0;
            
            this.interaction.enabled = true;
            this.interaction.boundingType = "rect";
            this._refresh();

            // プレーヤー
            this.player = parent.player;

            // ステータス終了ボタン
            var endButton = tm.app.GlossyButton(EXIT_BUTTON_WIDTH, EXIT_BUTTON_HEIGHT, "blue", "終了");
            endButton.position.set(EXIT_BUTTON_CENTER_X, EXIT_BUTTON_CENTER_Y);
            this.endButton = endButton;
            endButton.addEventListener("pointingend", function(e) {
                e.app.popScene();
            });

            // 画像
            var face = ns.Face(parent);
            face.position.set(170, 200);

            // 武器選択
            var weaponName = this.player.getWeapon() ? this.player.getWeapon().name : "装備無し";
            var weaponButton = tm.app.GlossyButton(280, 60, "gray", weaponName);
            weaponButton.setPosition(200, 500);
            this.weaponButton = weaponButton;

            // メニューボタン押下時の動作
            this.weaponButton.addEventListener("pointingend", function(e) {
                // メニューボタンが押されたらプルダウンを行う
                // 表示するデータを作成
                var pickerData = [{
                    text: "装備無し",
                    subData: {
                        dropImage: null,
                        name: "装備無し",
                        status: {
                            dis: 0,
                            str: 0,
                            def: 0,
                            agi: 0,
                            luk: 0,
                            vit: 0,
                            dex: 0
                        }
                    }
                }];
                for (var i = 0; i < parent.player.getItem().length; ++i) {
                    var itemType = parent.player.getItem()[i].type;
                    if (itemType === "shortsword" ||
                            itemType === "longsword") {
                        var pushData = {
                            text:    parent.player.getItem()[i].name,
                            subData: parent.player.getItem()[i]
                        }
                        pickerData.push(pushData);
                    }
                }
                e.app.pushScene(ns.iPhonePicker(this, pickerData));
            });

            // 防具選択
            var armorName = this.player.getArmor() ? this.player.getArmor().name : "装備無し";
            var armorButton = tm.app.GlossyButton(280, 60, "gray", armorName);
            armorButton.setPosition(200, 580);
            this.armorButton = armorButton;

            // メニューボタン押下時の動作
            this.armorButton.addEventListener("pointingend", function(e) {
                // メニューボタンが押されたらプルダウンを行う
                // 表示するデータを作成
                var pickerData = [{
                    text: "装備無し",
                    subData: {
                        dropImage: null,
                        name: "装備無し",
                        status: {
                            str: 0,
                            def: 0,
                            agi: 0,
                            luk: 0,
                            vit: 0,
                            dex: 0
                        }
                    }
                }];
                for (var i = 0; i < parent.player.getItem().length; ++i) {
                    var itemType = parent.player.getItem()[i].type;
                    if (itemType === "cloths" ||
                            itemType === "lightarmor") {
                        var pushData = {
                            text:    parent.player.getItem()[i].name,
                            subData: parent.player.getItem()[i]
                        }
                        pickerData.push(pushData);
                    }
                }
                e.app.pushScene(ns.iPhonePicker(this, pickerData));
            });


            // アイテム選択
            var medicineName = "使用するアイテムを選択";
            var medicineButton = tm.app.GlossyButton(280, 60, "gray", medicineName);
            medicineButton.setPosition(200, 660);
            this.medicineButton = medicineButton;

            // アイテム使用ボタン押下時の動作
            this.medicineButton.addEventListener("pointingend", function(e) {
                // メニューボタンが押されたらプルダウンを行う
                // 表示するデータを作成
                var pickerData = [{
                    text: "使用アイテムを選択",
                    subData: {
                        dropImage: null,
                        name: "使用アイテムを選択",
                        status: {
                            hp: 0,
                        }
                    }
                }];
                for (var i = 0; i < parent.player.getItem().length; ++i) {
                    var itemType = parent.player.getItem()[i].type;
                    if (itemType === "medicine") {
                        var pushData = {
                            text:    parent.player.getItem()[i].name,
                            subData: parent.player.getItem()[i]
                        }
                        pickerData.push(pushData);
                    }
                }
                e.app.pushScene(ns.iPhonePicker(this, pickerData));
            });

            // 画面に追加
            parent.addChild(this);
            parent.addChild(endButton);
            parent.addChild(weaponButton);
            parent.addChild(armorButton);
            parent.addChild(medicineButton);
            parent.addChild(face);

            // ステータス表示
            this.fromJSON(UI_DATA.LABELS);
            this._drawStatus();
        },

        _drawStatus: function () {
            this.statusLevel.text = "Lv."  + this.player.getLevel();
            // this.statusName.text  = "Name";// + this.player.getLevel();
            this.statusEXP.text   = "EXP " + this.player.getEXP() + "/" + this.player.getNextLevel();
            this.statusHP.text    = "HP "  + this.player.getCurrentHP() + "/" + this.player.getMaxHP();
            // this.statusMP.text    = "MP "  + this.player.getCurrentMP() + "/" + this.player.getMaxMP();
            this.statusSTR.text   = "攻撃力　" + this.player.getSTR() + " + " + (this.player.getWeapon().status.str + this.player.getArmor().status.str);
            this.statusDEF.text   = "防御力　" + this.player.getDEF() + " + " + (this.player.getWeapon().status.def + this.player.getArmor().status.def);
            this.statusAGI.text   = "速度   " + this.player.getAGI() + " + " + (this.player.getWeapon().status.agi + this.player.getArmor().status.agi);
            // this.statusLUK.text   = "LUK " + this.player.getLUK() + " + " + (this.player.getWeapon().status.luk + this.player.getArmor().status.luk);
            // this.statusVIT.text   = "VIT " + this.player.getVIT() + " + " + (this.player.getWeapon().status.vit + this.player.getArmor().status.vit);
            // this.statusDEX.text   = "DEX " + this.player.getDEX() + " + " + (this.player.getWeapon().status.dex + this.player.getArmor().status.dex);
        },
        
        _refresh: function() {
            // ボタン描画
            var c = this.canvas;
            c.resize(this.width, this.height);
            c.fillStyle = this.backgroundColor;
            c.fillRoundRect(2, 2, this.width-4, this.height-4, 10);
            c.strokeStyle   = "rgba(100,100,100,0.75)";
            c.lineWidth     = 2;
            c.strokeRoundRect(2, 2, this.width-4, this.height-4, 10);
        },

        update: function () {
            // ピッカーで何か選んだ時の動作
            if (this.weaponButton.returnedData) {
                this.player.equipWeapon(this.weaponButton.returnedData);
                this._drawStatus();
                this.weaponButton.returnedData = null;
            }
            if (this.armorButton.returnedData) {
                this.player.equipArmor(this.armorButton.returnedData);
                this._drawStatus();
                this.armorButton.returnedData = null;
            }
            // 食事
            if (this.medicineButton.returnedData) {
                this.player.eatMedicine(this.medicineButton.returnedData);

                var removeMedicineIte = 0
                for (var i = 0; i < this.player.getItem().length; ++i) {
                    var itemType = this.player.getItem()[i].type;
                    if (itemType === "medicine") {
                        ++removeMedicineIte;
                        if (removeMedicineIte === this.medicineButton.ite) {
                            // アイテム削除
                            this.player.deleteItem(i);
                        }
                    }
                }

                this._drawStatus();
                this.medicineButton.returnedData = null;
            }
        },
    });
})(game);