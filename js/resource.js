/**
 * リソースの読み込み
 */
tm.preload(function() {
	//tm.util.ScriptManager.loadStats();

	var STARTING_ASSETS = {
		// ローディング
		"loading":			"./rsc/effect/loading2.png",
	};
	tm.asset.AssetManager.load(STARTING_ASSETS);
});

var TITLE_ASSETS = {
};

var MAIN_ASSET = {
	// プレイヤー
	"player": 		"./rsc/player.png",
	"playerFace": 	"./rsc/char.png",

	// エフェクト
	"slash": 		"./rsc/boldslash.png",
	"enemydead":    "./rsc/effect/enemydead.png",

	// マップ
	"Dirt1_pipo": 	"./rsc/[A]Dirt1_pipo.png",
	"Grass1_pipo": 	"./rsc/[A]Grass1_pipo.png",
	"Water2_pipo": 	"./rsc/[A]Water2_pipo.png",
	"stairs": 		"./rsc/stairs.png",

	// アイテム
	"dropWeapon":   "./rsc/drop_weapon.png",
	"dropTreasure": "./rsc/item.png",

	// アイコン
	"attackIcon": 	"./rsc/icon000.png",
	"statusIcon": 	"./rsc/icon090.png",

	// モンスター
	"SlimeGreen":		"./rsc/[Monster]Slime_Green.png",
	"SlimeBlue":		"./rsc/[Monster]Slime_Blue.png",
	"SlimeRed":			"./rsc/[Monster]Slime_Red.png",
	// "SlimeGold":			"./rsc/[Monster]Slime_Gold.png",

	"SmallBatBlack":	"./rsc/[Monster]SmallBat_Black.png",
	"SmallBatGreen":	"./rsc/[Monster]SmallBat_Green.png",
	// "SmallBatRed":		"./rsc/[Monster]SmallBat_Red.png",
	// "SmallBatGhost":		"./rsc/[Monster]SmallBat_Ghost.png",

	"GoblinGrey": 		"./rsc/[Monster]Goblin_Grey.png",
	"GoblinGreen": 		"./rsc/[Monster]Goblin_Green.png",
	// "GoblinRed": 		"./rsc/[Monster]Goblin_Red.png",

	"BatBlack":	 		"./rsc/[Monster]Bat_Black.png",
	"BatGreen":	 		"./rsc/[Monster]Bat_Green.png",
	// "BatBlue":	 		"./rsc/[Monster]Bat_Blue.png",
	// "BatRed":	 		"./rsc/[Monster]Bat_Red2.png",
	// "BatWhite":	 		"./rsc/[Monster]Bat_White.png",

	"SkeltonNormal": 	"./rsc/[Monster]Skelton_Normal.png",
	// "SkeltonGreen": 		"./rsc/[Monster]Skelton_Green.png",
	// "SkeltonBlue": 		"./rsc/[Monster]Skelton_Blue.png",
	// "SkeltonRed": 		"./rsc/[Monster]Skelton_Red.png",

	"HarypyNormal":		"./rsc/[Monster]Harypy_Normal.png",

	"LizardManNormal":	"./rsc/[Monster]LizardMan_Normal.png",
	// "LizardManBlue":		"./rsc/[Monster]LizardMan_Blue.png",
	// "LizardManRed":		"./rsc/[Monster]LizardMan_Red.png",

	"ZombieNormal":		"./rsc/[Monster]Zombie_Normal.png",
	// "ZombieRed":			"./rsc/[Monster]Zombie_Red.png",

	// "GolemNormal":		"./rsc/[Monster]Golem_Normal.png",
	// "GolemGreen":		"./rsc/[Monster]Golem_Green.png",
	// "GolemBlue":			"./rsc/[Monster]Golem_Blue.png",
	// "GolemRed":			"./rsc/[Monster]Golem_Red.png",
	// "GolemGhost":		"./rsc/[Monster]Golem_Ghost.png",

	// "GhostNormal":		"./rsc/[Monster]Ghost_Normal.png",

	// "GargoyleBlack":		"./rsc/[Monster]Gargoyle_Black.png",
	// "GargoyleRed":		"./rsc/[Monster]Gargoyle_Red.png",

	"DragonGreen":		"./rsc/[Monster]Dragon_Green.png",
	// "DragonBlue":		"./rsc/[Monster]Dragon_Blue.png",
	// "DragonRed":			"./rsc/[Monster]Dragon_Red.png",
	// "DragonBlack":		"./rsc/[Monster]Dragon_Black.png",
	// "DragonWhite":		"./rsc/[Monster]Dragon_White.png",
	// "DragonGhost":		"./rsc/[Monster]Dragon_Ghost.png",

	// "Death":				"./rsc/[Monster]Death_Uroboros.png",
	
	// 音楽
	"levelup":		"./rsc/sound/[Action]Chinese_blade1_Komori.mp3",
	"openTreasure":	"./rsc/sound/[Action]Door01_Isooki.mp3",
	"downStairs":	"./rsc/sound/[Action]Steps1_Isooki.mp3",
	"playerdamage":	"./rsc/sound/[Effect]Attack6_panop.mp3",
	"enemydamage":	"./rsc/sound/[Effect]SHUN_panop.mp3",
	// "healing":		"./rsc/sound/[Effect]Healing2_panop.mp3",
	"enemydown":	"./rsc/sound/[Effect]SHUWAAAN3_panop.mp3",
	"playerdown":	"./rsc/sound/[Effect]ZAZAZAZA_panop.mp3",
	"enter":		"./rsc/sound/[System]Enter02_Koya.mp3",
	"openstatus":	"./rsc/sound/[System]Click_Komori.mp3",
	"equip":		"./rsc/sound/[Action]Switch2_Komori.mp3",
	"eat":			"./rsc/sound/[Action]Eating_soup_Komori.mp3",
	"dungeon":		"./rsc/sound/Dungeon02_Koya.mp3",
};

var RESULT_ASSETS = {
	"gameclear":	"./rsc/sound/Fanfare01_Koya.mp3",
};

var ASSET_MAP = {
	"TitleScene": TITLE_ASSETS,
	"MainScene": MAIN_ASSET,
	"ResultScene": RESULT_ASSETS,
};



