/**
 * Player
 */
(function(ns) {

	ns.Player = tm.createClass({
		superClass : ns.AnimationCharactor,

		init: function () {
			this.name = "player";
			// this.superInit("player");
			this.superInit("player", {
				width:  120/6,
				height: 112/4,
				count:  24,
			}, 3);
			// プレイヤーなので操作を受け付けるように設定
			this.isInput = true;
			this._isGameOver = false;

			// ダメージ= [[[最終ATK * スキル倍率 ] * (4000 + 除算Def) / (4000 + 除算DEF * 10)] * 種族耐性] - 減算DEF

			this.level = 1;

			this.maxhp = 30;
			this.hp    = 30;
			this.maxmp = 10;
			this.mp    = 10;

			this._str = 1; // 攻撃力
			this._def = 1; // 防御力
			// this._int = 40; // 魔力
			this._agi = 4; // 素早さ
			this._luk = 1; // 運
			this._vit = 1; // 体力
			this._dex = 1; // 器用さ

			this._aspd = 190; // 攻撃スピード

			this.speed = 5;

			this.exp = 0; // 取得経験値
			this.nextLevelExp = 8;

			this.item = [];

			this.equipedWeapon = null;
			this.equipedArmor  = null;
		},

		getLevel: function ()		{ return this.level; },
		getMaxHP: function ()		{ return this.maxhp; },
		getCurrentHP: function ()	{ return this.hp; },
		getMaxMP: function ()		{ return this.maxmp; },
		getCurrentMP: function ()	{ return this.mp; },
		getSTR: function ()			{ return this._str; },
		getDEF: function ()			{ return this._def; },
		getAGI: function ()			{ return this._agi; },
		getLUK: function ()			{ return this._luk; },
		getVIT: function ()			{ return this._vit; },
		getDEX: function ()			{ return this._dex; },
		getEXP: function ()			{ return this.exp; },
		getNextLevel: function ()	{ return this.nextLevelExp; },
		isGameOver: function ()		{ return this._isGameOver; },

		getSpeed: function () {
			return this.speed + (this.getLastAGI()/2 |0);
		},

		getLastAGI: function () {
			var agi = this.getAGI();
			if (this.equipedWeapon !== null) {
				agi += this.equipedWeapon.status.agi;
			}
			if (this.equipedArmor !== null) {
				agi += this.equipedArmor.status.agi;
			}
			return agi;
		},

		getAttackSpeed: function (fps) {
			// 攻撃速度を計算
			// var attackSpeed = this._aspd + Math.sqrt(this.getLastAGI() * (10 + 10/111) + (this.getDEX() * 9 / 49));
			var attackSpeed = this._aspd + Math.sqrt(this.getLastAGI() * (150000) + (this.getDEX() * 9 / 49));
			// attackSpeed = (attackSpeed > 190) ? 190 : (attackSpeed |0);
			// attackSpeed = (attackSpeed > 250) ? 190 : (attackSpeed |0);

			// フレーム速に変換して返す
			return fps / (attackSpeed / 150);
		},

		getDistanse: function () {
			if (this.equipedWeapon !== null) {
				return this.equipedWeapon.status.dis;
			}
			return 0;
		},

		eatMedicine: function (item) {
			if (!item.status) {
				return ;
			}
			this.hp += item.status.hp || 0;
			tm.sound.SoundManager.get("eat").play();
			if (this.hp > this.maxhp) {
				this.hp = this.maxhp;
			}
		},

		levelUp: function () {
			// パラメータ上昇
			this.maxhp += Math.rand(0, 10);
			this.maxmp += Math.rand(0, 5);
			this._str  += Math.rand(0, 2); // 攻撃力
			this._def  += Math.rand(0, 2); // 防御力
			// this._int = 40; // 魔力
			this._agi  += (Math.rand(0, 8) === 0) ? 1 : 0; // 素早さ
			this._luk  += Math.rand(0, 2); // 運
			this._vit  += Math.rand(0, 2); // 体力
			this._dex  += Math.rand(0, 2); // 器用さ

			// HP全回復
			this.hp = this.maxhp;
			this.mp = this.maxmp;

			// 音
			tm.sound.SoundManager.get("levelup").play();
		},

		addExp: function (exp) {
			this.exp += exp;
			if (this.exp >= this.nextLevelExp) {
				++this.level;
				this.nextLevelExp = Math.ceil(this.nextLevelExp * 1.4);
				this.levelUp();
				this.addExp(0);
			}
		},

		addItem: function (item) {
			this.item.push(item);
		},

		getItem: function () {
			return this.item;
		},

		deleteItem: function (itemNum) {
			this.item.splice(itemNum, 1);
		},

		equipWeapon: function (item) {
			if (item) {
				this.equipedWeapon = item;
				tm.sound.SoundManager.get("equip").play();
			}
			else {
				this.equipedWeapon = null;
			}
		},
		getWeapon: function () {
			if (this.equipedWeapon === null) {
				var result = {
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
				};
				return result;
			}
			return this.equipedWeapon;
		},

		equipArmor: function (item) {
			if (item) {
				this.equipedArmor = item;
				tm.sound.SoundManager.get("equip").play();
			}
			else {
				this.equipedArmor = null;
			}
		},
		getArmor: function () {
			if (this.equipedArmor === null) {
				var result = {
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
				};
				return result;
			}
			return this.equipedArmor;
		},

		getAttackPoint: function (attack) {
			// 攻撃力を計算
			var random = Math.rand(9, 11) / 10;
			var attackpoint = ((this._str + this._dex/5 + this._luk/3) * random)|0;
			attackpoint += this.getWeapon().status.str + this.getArmor().status.str;
			return attackpoint;
		},

		damage: function (attack) {
			var damage = (attack - this._def - this.getWeapon().status.def - this.getArmor().status.def) |0;
			damage = (damage < 0) ? 0 : damage;

			this.hp -= damage;
			this.hp = (this.hp < 0) ? 0 : this.hp;

			// hpが0になったら死亡
			if (this.hp <= 0) {
				this._isGameOver = true;
				tm.sound.SoundManager.get("playerdown").play();
			}

			return damage;
		},

		attack: function () {
			tm.sound.SoundManager.get("enemydamage").play();
			return this.angle;
		},

		update: function (app) {
			this.inputAnimation(app);
		}
	});

})(game);