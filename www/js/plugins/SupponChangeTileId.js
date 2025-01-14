/*
 * --------------------------------------------------
 * SupponChangeTileId.js
 *   Version 1.10
 * Copyright (c) 2016 Suppon
 * This software is released under the MIT license.
 * http://opensource.org/licenses/mit-license.php
 * --------------------------------------------------
 */

/*
Version 1.10.1 プラグイン導入前にセーブしたデータでエラーが出るのを解消。
*/

//=============================================================================
// SupponChangeTileId.js
//=============================================================================

/*:
 * @plugindesc マップタイルIDのコピー&ペーストを行います。
 * @author Suppon
 * @help
 *
 * 以下のようにプラグインコマンドを入力して、使ってください。
 * 
 * プラグインコマンド例1
 * -------------------------------------
 * SupponCTI add abc 1 2 3 4 5 11 12 13
 * -------------------------------------
 * この場合、データIDがabc、
 * コピー元のマップIDが1、
 * コピー元のX座標が2、
 * コピー元のY座標が3、
 * コピー元の幅が4、
 * コピー元の高さが5、
 * コピー先のマップIDが11、
 * コピー先のX座標が12、
 * コピー先のY座標が13、を意味します。
 * コピー元にリージョンが設定してあるとリージョンもコピーされます。
 * IDにはabcのような文字も使えます。
 * コピー元にB～Eタイルが無く、コピー先にB～Eタイルがある場合、
 * コピー先にあるB～Eはそのまま残ります。
 *
 *
 * プラグインコマンド例2
 * -------------------------------------
 * SupponCTI add abc 2 3 4 5 12 13
 * -------------------------------------
 * このようにマップIDを省略した場合、同じマップ間でのコピーとなります。
 *
 *
 * コピー先にB～Eタイルが無い状態を作りたい場合は以下のようにaddをchangeに
 * 置き換えてください。
 * プラグインコマンド例3
 * ----------------------------------------
 * SupponCTI change abc 1 2 3 4 5 11 12 13
 * ----------------------------------------
 *
 *
 * Aタイルのオートタイルを反映させたいときは
 * 以下のように入力してください。
 * プラグインコマンド例4
 * ----------------------------------------
 * SupponCTI auto abc 1 2 3 4 5 11 12 13
 * ----------------------------------------
 *
 *
 * コピーのデータを削除したいときは以下のようにIDを指定してください。
 * プラグインコマンド例5
 * ----------------------------------------
 * SupponCTI remove abc
 * ----------------------------------------
 * この場合、IDがabcのデータを削除します。
 * 同じIDのデータが複数ある場合には、一度に全て削除されます。
 *
 * プラグインコマンド例6
 * パターンを繰り返したい場合は以下のようにしてください。
 * -------------------------------------
 * SupponCTI add-r abc 1 2 3 4 5 11 12 13 21 22
 * -------------------------------------
 * この場合、データIDがabc、
 * コピー元のマップIDが1、
 * コピー元のX座標が2、
 * コピー元のY座標が3、
 * コピー元の幅が4、
 * コピー元の高さが5、
 * コピー先のマップIDが11、
 * コピー先のX座標が12、
 * コピー先のY座標が13、
 * X方向に21回繰り返し、
 * Y方向に22回繰り返すという形になります。
 * 以下のように同マップ内でのコピーではマップIDを省略することもできます。
 * -------------------------------------
 * SupponCTI add-r abc 2 3 4 5 12 13 21 22
 * -------------------------------------
 * B~Eタイルを完全に置き換える場合は、add-rをchange-rに, 
 * オートタイルに対応させたいときは、add-rをauto-rに変更してください。
 *
 * 変数を使用したい場合は、\v[1], \v[100]のように入力してください。
 *
 *
 * 利用規約:
 *   MITライセンスです。
 *   https://licenses.opensource.jp/MIT/MIT.html
 *   作者に無断で改変、再配布が可能で、
 *   利用形態（商用、18禁利用等）についても制限はありません。
 */

(function () {
    var AutoTilePattern = [
        [1, 1, 1,
            1, 1, 1,
            1, 1, 1],//0
        [0, 1, 1,
            1, 1, 1,
            1, 1, 1],//1
        [1, 1, 0,
            1, 1, 1,
            1, 1, 1],//2
        [0, 1, 0,
            1, 1, 1,
            1, 1, 1],//3
        [1, 1, 1,
            1, 1, 1,
            1, 1, 0],//4
        [0, 1, 1,
            1, 1, 1,
            1, 1, 0],//5
        [1, 1, 0,
            1, 1, 1,
            1, 1, 0],//6
        [0, 1, 0,
            1, 1, 1,
            1, 1, 0],//7
        [1, 1, 1,
            1, 1, 1,
            0, 1, 1],//8
        [0, 1, 1,
            1, 1, 1,
            0, 1, 1],//9
        [1, 1, 0,
            1, 1, 1,
            0, 1, 1],//10
        [0, 1, 0,
            1, 1, 1,
            0, 1, 1],//11
        [1, 1, 1,
            1, 1, 1,
            0, 1, 0],//12
        [0, 1, 1,
            1, 1, 1,
            0, 1, 0],//13
        [1, 1, 0,
            1, 1, 1,
            0, 1, 0],//14
        [0, 1, 0,
            1, 1, 1,
            0, 1, 0],//15
        [0, 1, 1,
            0, 1, 1,
            0, 1, 1],//16
        [0, 1, 0,
            0, 1, 1,
            0, 1, 1],//17
        [0, 1, 1,
            0, 1, 1,
            0, 1, 0],//18
        [0, 1, 0,
            0, 1, 1,
            0, 1, 0],//19
        [0, 0, 0,
            1, 1, 1,
            1, 1, 1],//20
        [0, 0, 0,
            1, 1, 1,
            1, 1, 0],//21
        [0, 0, 0,
            1, 1, 1,
            0, 1, 1],//22
        [0, 0, 0,
            1, 1, 1,
            0, 1, 0],//23
        [1, 1, 0,
            1, 1, 0,
            1, 1, 0],//24
        [1, 1, 0,
            1, 1, 0,
            0, 1, 0],//25
        [0, 1, 0,
            1, 1, 0,
            1, 1, 0],//26
        [0, 1, 0,
            1, 1, 0,
            0, 1, 0],//27
        [1, 1, 1,
            1, 1, 1,
            0, 0, 0],//28
        [0, 1, 1,
            1, 1, 1,
            0, 0, 0],//29
        [1, 1, 0,
            1, 1, 1,
            0, 0, 0],//30
        [0, 1, 0,
            1, 1, 1,
            0, 0, 0],//31
        [0, 1, 0,
            0, 1, 0,
            0, 1, 0],//32
        [0, 0, 0,
            1, 1, 1,
            0, 0, 0],//33
        [0, 0, 0,
            0, 1, 1,
            0, 1, 1],//34
        [0, 0, 0,
            0, 1, 1,
            0, 1, 0],//35
        [0, 0, 0,
            1, 1, 0,
            1, 1, 0],//36
        [0, 0, 0,
            1, 1, 0,
            0, 1, 0],//37
        [1, 1, 0,
            1, 1, 0,
            0, 0, 0],//38
        [0, 1, 0,
            1, 1, 0,
            0, 0, 0],//39
        [0, 1, 1,
            0, 1, 1,
            0, 0, 0],//40
        [0, 1, 0,
            0, 1, 1,
            0, 0, 0],//41
        [0, 0, 0,
            0, 1, 0,
            0, 1, 0],//42
        [0, 0, 0,
            0, 1, 1,
            0, 0, 0],//43
        [0, 1, 0,
            0, 1, 0,
            0, 0, 0],//44
        [0, 0, 0,
            1, 1, 0,
            0, 0, 0],//45
        [0, 0, 0,
            0, 1, 0,
            0, 0, 0]//46
    ];

    var AutoTilePattern2 = [
        [0, 1, 0,
            1, 1, 1,
            0, 1, 0],//0
        [0, 1, 0,
            0, 1, 1,
            0, 1, 0],//1
        [0, 0, 0,
            1, 1, 1,
            0, 1, 0],//2
        [0, 0, 0,
            0, 1, 1,
            0, 1, 0],//3
        [0, 1, 0,
            1, 1, 0,
            0, 1, 0],//4
        [0, 1, 0,
            0, 1, 0,
            0, 1, 0],//5
        [0, 0, 0,
            1, 1, 0,
            0, 1, 0],//6
        [0, 0, 0,
            0, 1, 0,
            0, 1, 0],//7
        [0, 1, 0,
            1, 1, 1,
            0, 0, 0],//8
        [0, 1, 0,
            0, 1, 1,
            0, 0, 0],//9
        [0, 0, 0,
            1, 1, 1,
            0, 0, 0],//10
        [0, 0, 0,
            0, 1, 1,
            0, 0, 0],//11
        [0, 1, 0,
            1, 1, 0,
            0, 0, 0],//12
        [0, 1, 0,
            0, 1, 0,
            0, 0, 0],//13
        [0, 0, 0,
            1, 1, 0,
            0, 0, 0],//14
        [0, 0, 0,
            0, 1, 0,
            0, 0, 0],//15
        [0, 0, 0,
            0, 0, 0,
            0, 0, 0]//16
    ];
    var AutoTilePattern3 = [
        [0, 0, 0,
            1, 1, 1,
            0, 0, 0],//0
        [0, 0, 0,
            0, 1, 1,
            0, 0, 0],//1
        [0, 0, 0,
            1, 1, 0,
            0, 0, 0],//2
        [0, 0, 0,
            0, 1, 0,
            0, 0, 0]//3
    ]

    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command1, args) {
        _Game_Interpreter_pluginCommand.call(this, command1, args);
        args = args.filter(function (n) {
            return n !== '';
        });
        if (!$gameParty._supponCTI) { $gameParty._supponCTI = [] };
        if (command1 === 'SupponCTI') {
            args = args.map(function (element) {
                return this.convertEscapeCharacters(element);
            }, this)
            var command2 = args.shift();
            switch (command2) {
                case 'add':
                    args.push(0);
                    $gameParty.addSupponCTI(args);
                    break;
                case 'change':
                    args.push(1);
                    $gameParty.addSupponCTI(args);
                    break;
                case 'auto':
                    args.push(2);
                    $gameParty.addSupponCTI(args);
                    break;
                case 'add-r':
                    args.push(3);
                    $gameParty.addSupponCTI(args);
                    break;
                case 'change-r':
                    args.push(4);
                    $gameParty.addSupponCTI(args);
                    break;
                case 'auto-r':
                    args.push(5);
                    $gameParty.addSupponCTI(args);
                    break;
                case 'remove':
                    $gameParty.removeSupponCTI(args[0]);
                    break;
            }
        }
    };

    Game_Interpreter.prototype.convertEscapeCharacters = function (text) {
        try {
            return Yanfly.Message.Window_Base_convertEscapeCharacters.call(this, text);
        } catch (e) {
            return Window_Base.prototype.convertEscapeCharacters.call(this, text);
        }
    }

    var _Game_Party_initialize = Game_Party.prototype.initialize
    Game_Party.prototype.initialize = function () {
        _Game_Party_initialize.call(this);
        this._supponCTI = [];
    };

    //  セーブデータ対策

    var _Game_System_onAfterLoad = Game_System.prototype.onAfterLoad;
    Game_System.prototype.onAfterLoad = function () {
        if (!$gameParty._supponCTI) {
            $gameParty._supponCTI = [];
        }
        if (!$gameMap._supponCTI) {
            $gameMap._supponCTI = [];
        }
        _Game_System_onAfterLoad.call(this);
    };


    Game_Party.prototype.addSupponCTI = function (args) {
        if (args.length == 12) {
            var args = [args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[11] - 3, args[9], args[10]];
        }
        if (args.length == 8) {
            if (args[7] <= 2) {
                var args = [args[0], $gameMap.mapId(), args[1], args[2], args[3], args[4],
                $gameMap.mapId(), args[5], args[6], args[7], 1, 1]; //末尾に繰り返しに回数
            }
        }

        if (args.length == 10) { //繰り返し回数0を追加

            if (args[9] <= 2) {
                var args = [args[0], args[1], args[2], args[3], args[4], args[5],
                args[6], args[7], args[8], args[9], 1, 1]; //末尾に繰り返しに回数
            } else { //マップidを追加
                args[9] = args[9] - 3;
                var args = [args[0], $gameMap.mapId(), args[1], args[2], args[3], args[4],
                $gameMap.mapId(), args[5], args[6], args[9], args[7], args[8]];
            }
        }

        if (args.length != 12) {
            window.alert('Wrong args in supponCTI plugin');
            return;
        }


        //        var stop = false;
        //        this._supponCTI.forEach(function(element){
        //            if(element.equals(args)){
        //                stop = true;
        //                
        //            };
        //        })
        //        if(stop){return};

        this._supponCTI.push(args);
        if (args[6] == $gameMap.mapId()) {
            $gameMap._supponCTI.push(args);
        }
    }

    Game_Party.prototype.removeSupponCTI = function (id) {
        this._supponCTI = this._supponCTI.filter(function (args) {
            return args[0] !== id;
        })
        $gamePlayer._fadeType = null;
        SceneManager.goto(Scene_Map);
    }

    var _Game_Temp_initialize = Game_Temp.prototype.initialize
    Game_Temp.prototype.initialize = function () {
        _Game_Temp_initialize.call(this);
        this._supponCTINextMapId = 0;
    };


    var _Game_Map_initialize = Game_Map.prototype.initialize;
    Game_Map.prototype.initialize = function () {
        _Game_Map_initialize.call(this);
        this._supponCTI = [];
    };

    var _Game_Map_update = Game_Map.prototype.update;
    Game_Map.prototype.update = function (sceneActive) {
        if (this._supponCTI.length > 0) {
            this.updateSupponCTI();
        } else {
            _Game_Map_update.call(this, sceneActive);
        }
    };

    Game_Map.prototype.updateSupponCTI = function () {
        while (this._supponCTI.length > 0) {
            var a = this._supponCTI[0]
            if (this.mapId() == a[1]) {
                //転送元のマップIDが現在のマップIDと同じなら
                var args = this._supponCTI.shift();
                DataManager.applySupponCTI(args, $dataMap);
            } else {
                //転送元のマップIDが現在のマップIDと違う場合
                if ($gameTemp._supponCTINextMapId != a[1]) {
                    //ロードが必要
                    $dataMapForSupponCTI = null;
                    var filename = 'Map%1.json'.format(a[1].padZero(3));
                    DataManager.loadDataFile('$dataMapForSupponCTI', filename);
                    $gameTemp._supponCTINextMapId = a[1];
                }
                if ($dataMapForSupponCTI) {
                    //転送元のマップがロードされたら
                    var args = this._supponCTI.shift();
                    DataManager.applySupponCTI(args, $dataMapForSupponCTI);
                }
                if (!$dataMapForSupponCTI) {
                    return;
                }
            }
        }
    }

    $dataMapForSupponCTI = null;

    DataManager.applyAllSupponCTI = function () {
        if (!$gameParty._supponCTI) { $gameParty._supponCTI = [] };
        $gameParty._supponCTI.forEach(function (args) {
            if (args[6] == $gameMap.mapId()) {
                $gameMap._supponCTI.push(args);
            }
        }, this);
    }

    DataManager.applySupponCTI = function (args, sender) {
        if (args.length == 10) {
            var repeatX = 1;
            var repeatY = 1;
            var mode = Number(args[9]);
        } else {
            var repeatX = Number(args[10]);
            var repeatY = Number(args[11]);
            var mode = Number(args[9]);
        }
        //var repeatX = (args.length != 12) ? 0: Number(args[10]);
        //var repeatY = (args.length != 12) ? 0: Number(args[11]);

        var id = Number(args[0]);
        var s = Number(args[1]);//送り元のマップID
        var x1 = Number(args[2]);
        var y1 = Number(args[3]);
        var w = Number(args[4]);
        var h = Number(args[5]);
        var d = Number(args[6]);//送り先のマップID
        var x2o = Number(args[7]);
        var y2o = Number(args[8]);
        //var mode = Number(args[9]);
        var width = $dataMap.width;
        var height = $dataMap.height;
        var width0 = sender.width;
        var height0 = sender.height;
        var autoAdj = 0;
        for (var ry = 0; ry < repeatY; ry++) {
            var y2 = y2o + ry * h;

            for (var rx = 0; rx < repeatX; rx++) {
                var x2 = x2o + rx * w;

                for (var i = 0; i < h; i++) {
                    if (0 > y2 + i || y2 + i >= height) { continue };
                    for (var j = 0; j < w; j++) {
                        if (0 > x2 + j || x2 + j >= width) { continue };
                        for (var z = 0; z < 6; z++) {
                            var id0 = sender.data[(z * height0 + (y1 + i)) * width0 + (x1 + j)];
                            var id1 = $dataMap.data[(z * height + (y2 + i)) * width + (x2 + j)];
                            var id2 = sender.data[(0 * height0 + (y1 + i)) * width0 + (x1 + j)];
                            var isWall = 4351 < id2 && id2 < 8192;
                            if ($gameMap.tileset().mode == 0 && id0 == 2720) { continue };

                            var c = (mode == 0 && id0 != 0 || mode >= 1);
                            if (c || (z == 4 && isWall)) {

                                //var under = $dataMap.data[(2 * height + (y2+i)) * width + (x2+j)];
                                //if(z==3 && under==0){
                                //$dataMap.data[(2 * height + (y2+i)) * width + (x2+j)] = 
                                //$dataMap.data[(z * height + (y2+i)) * width + (x2+j)]
                                //}
                                //var id3 = sender.data[(z * height0 + (y1+i)) * width0 + (x1+j)];
                                if (z == 3 && mode == 0 && id0 != 0) {
                                    $dataMap.data[((z - 1) * height + (y2 + i)) * width + (x2 + j)] =
                                        $dataMap.data[(z * height + (y2 + i)) * width + (x2 + j)];
                                }
                                $dataMap.data[(z * height + (y2 + i)) * width + (x2 + j)] =
                                    sender.data[(z * height0 + (y1 + i)) * width0 + (x1 + j)];
                            }
                            if (mode == 2 && (z == 0 || z == 1)) {
                                this.refreshAutoTiles(x2 + j, y2 + i, z);
                                //autoAdj = this.calcAutoAdj(x2, y2, z);
                                //$dataMap.data[(z * height + (y2+i)) * width + (x2+j)] += autoAdj;
                            }
                        }
                    }
                }
            }
        }

        SceneManager._scene._spriteset._tilemap.refresh();
    }

    DataManager.refreshAutoTiles = function (x, y, z) {
        for (var i = -1; i < 2; i++) {
            for (var j = -1; j < 2; j++) {
                if (!$gameMap.isValid(x + j, y + i)) { continue };
                this.refreshAutoTile(x + j, y + i, z);
                //var tileId = $gameMap.tileId(x+j, y+i, z);
                //match.push(Tilemap.isSameKindTile(centerTileId,tileId) ? 1 : 0)
            }
        }
    }

    DataManager.refreshAutoTile = function (x, y, z) {
        var match = [];
        var width = $dataMap.width;
        var height = $dataMap.height;
        var centerId = $gameMap.tileId(x, y, z);
        var centerKind = Tilemap.getAutotileKind(centerId);
        for (var i = -1; i < 2; i++) {
            for (var j = -1; j < 2; j++) {
                var tileId = $gameMap.tileId(x + j, y + i, z);
                var kind = Tilemap.getAutotileKind(tileId)
                if (!$gameMap.isValid(x + j, y + i)) {
                    match.push(1)
                }
                else if (i != 0 && Tilemap.isWaterTile(centerId) && Tilemap.isWaterfallTile(tileId)) {
                    match.push(1);
                } else {
                    match.push(Tilemap.isSameKindTile(centerId, tileId) ? 1 : 0)
                }
            }
        }
        if (Tilemap.isFloorTypeAutotile(centerId)) {
            var shape = this.getShapeFloorType(match);
        } else if (Tilemap.isWallTile(centerId) || Tilemap.isRoofTile(centerId)) {
            //console.log('wall')
            var shape = this.getShapeWallTile(match);
        } else {
            var shape = this.getShapeWaterfall(match);
        }
        var newId = Tilemap.makeAutotileId(centerKind, shape);
        //        if (Tilemap.isTileA1(centerId)){
        //            var newId = Tilemap.makeAutotileId(centerKind, shape);
        //        }
        //        if (Tilemap.isTileA2(centerId)){
        //           var newId = Tilemap.makeAutotileId(centerKind, shape);
        //        }
        //var newId = Tilemap.makeAutotileId(centerKind, shape);
        if (centerKind >= 0) {
            //console.log('aaaa', centerKind, shape, newId)
            $dataMap.data[(z * height + y) * width + x] = newId;
        }


    }

    //    Tilemap.makeAutotileIdA2 = function(kind, shape) {
    //        return this.TILE_ID_A2 + kind * 48 + shape;
    //    };

    DataManager.getShapeFloorType = function (match) {
        if (match[1] == 0) {
            match[0] = 0; match[2] = 0;
        }
        if (match[3] == 0) {
            match[0] = 0; match[6] = 0;
        }
        if (match[5] == 0) {
            match[2] = 0; match[8] = 0;
        }
        if (match[7] == 0) {
            match[6] = 0; match[8] = 0;
        }
        return AutoTilePattern.indexOfArray(match);
    }

    DataManager.getShapeWallTile = function (match) {
        match[0] = 0;
        match[2] = 0;
        match[6] = 0;
        match[8] = 0;
        return AutoTilePattern2.indexOfArray(match);
    }

    DataManager.getShapeWaterfall = function (match) {
        match[0] = 0;
        match[1] = 0;
        match[2] = 0;
        match[6] = 0;
        match[7] = 0;
        match[8] = 0;
        return AutoTilePattern3.indexOfArray(match);
    }

    Array.prototype.indexOfArray = function (element) {
        for (var i = 0; i < this.length; i++) {
            if (this[i].equals(element)) {
                return i;
            }
        }
        return -1;
    }

    var _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function () {
        _Scene_Map_start.call(this)
        DataManager.applyAllSupponCTI();
    };

    Tilemap.isWallSideTile = function (tileId) {
        return (this.isTileA3(tileId) || this.isTileA4(tileId)) &&
            this.getAutotileKind(tileId) % 16 >= 8;
    };

    //    var _Game_Player_updateNonmoving = Game_Player.prototype.updateNonmoving;
    //        Game_Player.prototype.updateNonmoving = function(wasMoving) {
    //        _Game_Player_updateNonmoving.call(this, wasMoving);
    //        if(wasMoving){
    //            for (var i=0; i<6; i++){
    //                var tileId = $gameMap.tileId(this._x, this._y, i);
    //                var kind = Tilemap.getAutotileKind(tileId);
    //                var shape = Tilemap.getAutotileShape(tileId);
    //                console.log(i, '  ', tileId, ' kind', kind, 'shape', shape)
    //            }
    //            console.log(' ')
    //        }
    //    };


})();
