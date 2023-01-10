import { Chat } from "./chat.js"
//import {send_json_test} from "./chattest/index.js"

let charm = new Charm(PIXI); // 用來製作動畫效果的

//const socket = io.connect("http://123.192.160.184:5000");
const socket = io.connect("http://127.0.0.1:5000");
console.log(socket);

let myPlayer, state;
let otherPlayer = [];
let otherPlayerChat = [];
let PlayerImageTexture;
let playerW = 50, playerH = 70;
let playerStartX = 530, playerStartY = 150;
let PlayerInfo = {
    //name: prompt('請輸入名稱: '),
    name: jsusername,
    id: null
}
let BagItem_y = 130;
let ItemCount = 6;
let gameHeight = 1200;
let left    = keyboard(37),
    up      = keyboard(38),
    right   = keyboard(39),
    down    = keyboard(40);

let chatCloud; // 存聊天雲用的物件

let input; // 即時輸入框物件
let text = ""; // 暫存輸入框文字

//Create a Pixi Application
const app = new PIXI.Application({
    width: 1810,
    height: 1220,
    antialias: true,
    backgroundColor: 0xFFFFFF
});
//Add the canvas that Pixi automatically created for you to the HTML document
document.getElementById('GameCanvas').appendChild(app.view);

app.loader
    .add("/static/images/Achievement_map.jpg")
    .add("/static/images/character.png")
    .load(setup);
function setup() {
    //Initialize the game sprites, set the game `state` to `play`
    //and start the 'gameLoop'

    setBagBar(180, gameHeight);
    setGameScene(1600, gameHeight);

    
    // ========== Set all player on map ==========
    //寫socket.io --2022/8/1 下午11:20
    PlayerInfo.id = GetID();
    socket.emit('initialize', PlayerInfo);
    
    myPlayer = createPlayer(PlayerInfo);
    app.stage.addChild(myPlayer);

    chatCloud = new Chat( charm, myPlayer ) ; // 設定cloud chat跟著此個player
    setTextInput(); // 設定輸入框

    socket.on("AddPlayer", SaveOtherPlayer);
    socket.on("RemovePlayer", SaveOtherPlayer);

    // Update Player Coordinate
    setInterval(() => {
        socket.emit('update', myPlayer.id, myPlayer.x, myPlayer.y);
    }, 50);
    
    socket.on('updateCoordinate', function(json) {
        for (var i = 0; i < app.stage.children.length; i++) {
            if(app.stage.children[i].id != undefined && app.stage.children[i].id == json["id"]) {
                app.stage.children[i].x = json["x"];
                app.stage.children[i].y = json["y"];
            }
        }
    });
    PlayerMove(myPlayer);

    socket.on('updateChat', function(json) {
        for (var i = 0; i < otherPlayerChat.length; i++) {
            if(otherPlayerChat[i]['id'] != undefined && otherPlayerChat[i]['id'] == json["id"]) {
                otherPlayerChat[i]['chatCloud'].message.text = json['text'];
                otherPlayerChat[i]['chatCloud'].Show( charm ) ;
            }
        }
    });
    state = play;
    app.ticker.add(delta =>gameLoop(delta));
} // setup()

function gameLoop(delta) {
    //Runs the current game `state` in a loop and renders the sprites
    state(delta);
    charm.update();
} // gameLoop()
  
function play(delta) {
    //All the game logic goes here
    myPlayer.x += myPlayer.vx;
    if ( myPlayer.x < 200 )
        myPlayer.x = 200 ;
    else if ( myPlayer.x > 1750 )
        myPlayer.x = 1750 ;

    myPlayer.y += myPlayer.vy;
    if ( myPlayer.y < -15 )
        myPlayer.y = -15 ;
    else if ( myPlayer.y > 1115 )
        myPlayer.y = 1115 ;

} // play()

function end() {
    //All the code that should run at the end of the game
} // end()
  
function PlayerMove(Player) { 
    let speed = 5;
    //Left arrow key `press` method
    left.press = () => {
        //Change the Player's velocity when the key is pressed
        Player.vx = -(speed);
        Player.vy = 0;
    };
    //Left arrow key `release` method
    left.release = () => {
        //If the left arrow has been released, and the right arrow isn't down,
        //and Player isn't moving vertically:
        //Stop Player
        if (!right.isDown && Player.vy === 0) {
            Player.vx = 0;
        }
    };

    //Up
    up.press = () => {
        Player.vy = -(speed);
        Player.vx = 0;
    };
    up.release = () => {
        if (!down.isDown && Player.vx === 0) {
            Player.vy = 0;
        }
    };

    //Right
    right.press = () => {
        Player.vx = speed;
        Player.vy = 0;
    };
    right.release = () => {
        if (!left.isDown && Player.vy === 0) {
            Player.vx = 0;
        }
    };

    //Down
    down.press = () => {
        Player.vy = speed;
        Player.vx = 0;
    };
    down.release = () => {
        if (!up.isDown && Player.vx === 0) {
            Player.vy = 0;
        }
    };

    
} // PlayerMove()

//The 'keyboard' helper function
function keyboard(keyCode) {
    var key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    key.string = "";
    if(keyCode == 37) key.string = "LEFT";
    else if(keyCode == 38) key.string = "UP";
    else if(keyCode == 39) key.string = "RIGHT";
    else if(keyCode == 40) key.string = "DOWN";
    
    //The 'down Handler'
    key.downHandler = event => {
      if (event.keyCode === key.code) {
        if (key.isUp && key.press) {
            // console.log(myPlayer.name, myPlayer.id, ", Move direction:", key.string);
            key.press();
        }
        key.isDown = true;
        key.isUp = false;
      }

      // event.preventDefault();
    };
  
    //The 'up Handler'
    key.upHandler = event => {
      if (event.keyCode === key.code) {
        if (key.isDown && key.release) {
            key.release();
        };
        key.isDown = false;
        key.isUp = true;
      }
      // event.preventDefault();
    };
  
    //Attach event listeners
    window.addEventListener( "keydown", key.downHandler.bind(key), false );
    window.addEventListener( "keyup", key.upHandler.bind(key), false );

    return key;
} // keyboard()
  
function GetID(){
    return socket.id;
} // GetID()

function setBagBar(width, height) {
    let BagBar = new PIXI.Container();
    let bagBG = new PIXI.Graphics();
    bagBG.beginFill(0x8F6128);
    bagBG.drawRoundedRect(10, 10, width, height, 10); 
    bagBG.endFill();
    BagBar.addChild(bagBG);
    let BagTitle = new PIXI.Text('背包', {
        fontSize: 36,
        fill: 0xFFFFFF
    });
    BagTitle.x = (width - BagTitle.width) / 2 + 10;
    BagTitle.y = 50;
    BagBar.addChild(BagTitle);
    BagBar.name = 'BagBar';
    for (let i = 0; i < ItemCount; i++){
        let bagItem = new PIXI.Graphics();
        bagItem.beginFill(0xFFFFFF);
        bagItem.drawRoundedRect(20, BagItem_y, 160, 170, 10);
        bagItem.endFill();
        BagBar.addChild(bagItem);
        BagItem_y += 180;
    }
    app.stage.addChild(BagBar);
} // setBagBar()

function setGameScene(width, height) {
    let gameScene =  new PIXI.Container();
    gameScene.name = 'gameScene';
    let gameBG = new PIXI.Sprite(app.loader.resources["/static/images/Achievement_map.jpg"].texture);
    gameBG.x = 200;
    gameBG.y = 10;
    gameBG.width = width;
    gameBG.height = height;
    gameScene.addChild(gameBG);
    app.stage.addChild(gameScene);
} // setGameScene()

function createPlayer(PlayerInfo) {
    console.log("CreatePlayer");
    let PlayerContainer = new PIXI.Container();


    socket.emit('test', PlayerInfo);
    
    socket.on('testcallback', (img) => {
        if (PlayerInfo['name'] == img['name']) {
            console.log('match:'+img['name']);
            let Player = new PIXI.Sprite(PIXI.Texture.from(img['imgstr']));
            Player.width = playerW;
            Player.height = playerH;
            Player.x = 0;
            Player.y = 25;
            PlayerContainer.addChild(Player);
        }
    });


    //let Player = new PIXI.Sprite(PIXI.Texture.from("/static/images/character.png"));


    let Name = new PIXI.Text(PlayerInfo.name, {
        fontSize: 18,
        fill: 0xFFFFFF
    });
    let NameBG = new PIXI.Graphics();
    NameBG.beginFill(0x000000, 0.3);
    NameBG.drawRoundedRect((playerW - Name.width - 8) / 2, 0, Name.width + 8, 23, 5)
    NameBG.endFill();
    // PlayerContainer.interactive = true;
    // PlayerContainer.buttonMode = true;
    PlayerContainer.name = PlayerInfo.name;
    PlayerContainer.id = PlayerInfo.id;
    PlayerContainer.x = playerStartX;
    PlayerContainer.y = playerStartY;
    PlayerContainer.vx = 0;
    PlayerContainer.vy = 0;




    
    Name.x = (playerW - Name.width) / 2;
    Name.y = 1;
    PlayerContainer.addChild(NameBG);
    PlayerContainer.addChild(Name);
    

    return PlayerContainer;
} // createPlayer()

function SaveOtherPlayer(Players) { // Player(陣列)裡面放的是場上目前所有玩家的資料
    otherPlayer.length = 0;
    let isInGame = false, isInArray = false;
    let thePlayer;
    let tmpchatCloud;
    let tmpChatImformation = {};
    for (var i = 0; i < Players.length; i++) {
        if(Players[i].id != socket.id) {
            otherPlayer.push(Players[i]);
        }
    }
    
    // 判斷otherPlayer中的玩家是否存在於app.stage中，若沒有，將此玩家addChild()進app.stage
    for (var i = 0; i < otherPlayer.length; i++) {
        isInGame = false;
        // 抓此Player是否存在app.stage裡
        for (var j = 0; j < app.stage.children.length; j++) {
            if (app.stage.children[j].id != undefined) {
                if (otherPlayer[i].id == app.stage.children[j].id) {
                    isInGame = true;
                    break;
                }
            }
        }
        if (isInGame == false) {
            thePlayer = createPlayer(otherPlayer[i]);
            app.stage.addChild(thePlayer);

            tmpchatCloud = new Chat(charm, thePlayer);
            tmpChatImformation = {'id': thePlayer.id, 'chatCloud': tmpchatCloud};
            otherPlayerChat.push(tmpChatImformation);
        }
    }
    // 與上述相反(做移除玩家的動作)
    for (var i = 0; i < app.stage.children.length; i++) {
        if (app.stage.children[i].id != undefined && app.stage.children[i].id != myPlayer.id) {
            isInArray = false;
            for (var j = 0; j < otherPlayer.length; j++) {
                    if (app.stage.children[i].id == otherPlayer[j].id) {
                        isInArray = true;
                        break;
                    }
            }
            if (isInArray == false) {
                app.stage.removeChild(app.stage.children[i]);
            }
        }
    }


} // SaveOtherPlayer()

function setTextInput(){
    // 即時輸入框
    input = new PIXI.TextInput({
		input: {
			fontSize: '36px',
			padding: '12px',
			width: '500px',
			color: '#26272E'
		},
		box: {
			default: {fill: 0xE8E9F3, rounded: 12, stroke: {color: 0xCBCEE0, width: 3}},
			focused: {fill: 0xE1E3EE, rounded: 12, stroke: {color: 0xABAFC6, width: 3}},
			disabled: {fill: 0xDBDBDB, rounded: 12}
		}
	});

    // 發送訊息

	input.placeholder = 'Enter your Text...';
	input.x = 500;
	input.y = 1150;
	input.pivot.x = input.width/2;
	input.pivot.y = input.height/2;
	
	input.on('keydown', keycode => {
		if ( keycode == 13 ) { // 送出訊息
			text = input.text;
            chatCloud.message.text = text; // 傳給chat cloud message
			input.text = null; // 清空輸入框

            // chat cloud打開
            chatCloud.Show( charm ) ;
            socket.emit('chat', myPlayer.id, text);
            
            //alertstring = send_json_test();
            //window.alert(alertstring);
		}
	})
	// input.on('input', t => {
	// 	console.log(t);
	// })

	app.stage.addChild(input);
    
} // setTextInput()

async function getImgUrl(PlayerInfo) {
    let imgurl = '';
    socket.emit('test', PlayerInfo);

    await socket.on('testcallback', (imgstring) => {
        console.log(imgstring);
        imgurl = imgstring ;
        return imgstring;
    });
    setTimeout("", 3000 )
    return imgurl ;
}

