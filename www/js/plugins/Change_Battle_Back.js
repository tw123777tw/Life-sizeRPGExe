//=============================================================================
// Change_Battle_Back.js
//=============================================================================

/*:
 * @plugindesc 戦闘中に「戦闘背景の変更」を実行可能にします。
 * @author 村人C
 *
 * @help
 *
 * 使い方
 * イベントコマンド:
 * 戦闘中にコマンドの「戦闘背景の変更」を使用することで切り替わります。
 *
 * 仕様
 * 戦闘開始 0 ターンに戦闘の背景を変更しても少しの間、元の背景が表示されます。
 * 戦闘開始前にイベントで戦闘の背景を変更した場合は、その背景が戦闘後も引き継がれます(デフォルトの仕様です)。
 * イベント戦闘後に再度、戦闘の背景を変更することで、上記は解決できます。
 *
 *
 * readmeやスタッフロールの明記、使用報告は任意
 */

// 戦闘背景の変更 再定義
Game_Interpreter.prototype.command283 = function() {
	if ($gameParty.inBattle()) {
		if ($gameTemp._change_battle_back[0] === '') { // 空なら背景の一時保存
			$gameTemp._change_battle_back = [$gameMap._battleback1Name, $gameMap._battleback2Name];
		}
		SceneManager._scene._change_battle_back(this._params[0], this._params[1]); // 背景の変更
	}
	// 元の処理
	$gameMap.changeBattleback(this._params[0], this._params[1]);
    return true;
};

// 追加
var _Game_Temp_initialize_change_battle_back = Game_Temp.prototype.initialize;
Game_Temp.prototype.initialize = function() {
	_Game_Temp_initialize_change_battle_back.call(this);
    this._change_battle_back = ['', ''];
};

// 追加
var _Scene_Battle_terminate_change_battle_back = Scene_Battle.prototype.terminate;
Scene_Battle.prototype.terminate = function() {
	if ($gameTemp._change_battle_back[0] !== '') { // 背景を元に戻す
		$gameMap.changeBattleback($gameTemp._change_battle_back[0], $gameTemp._change_battle_back[1]);
		$gameTemp._change_battle_back = ['', '']; // 一時保存を初期化
	}
	_Scene_Battle_terminate_change_battle_back.call(this);
};

// 追加
Scene_Battle.prototype._change_battle_back = function(image1, image2) {
	this._spriteset.change_battle_back(image1, image2); // 処理
};

// 追加
Spriteset_Battle.prototype.change_battle_back = function(image1, image2) { // 実行
	this._back1Sprite.bitmap = ImageManager.loadBattleback1(image1);
    this._back2Sprite.bitmap = ImageManager.loadBattleback2(image2);
};