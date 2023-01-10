export class Chat {
  constructor( charm, container ) {
    this.charm = charm;
    this.playerContainer = container;
    this.cloud = new PIXI.Graphics();
    this.triangle = new PIXI.Graphics();
    this.message = new PIXI.Text("Hello!", {
      fontSize: 25,
      align: "center"
    });

    // 全部丟到跟Plyer同一個Container
    this.playerContainer.addChild(this.cloud) ;
    this.playerContainer.addChild(this.triangle) ;
    this.playerContainer.addChild(this.message) ;

    this.cloud.alpha = 0 ;
    this.triangle.alpha = 0 ;
    this.message.alpha = 0 ;
  }

  Show() {
    let charm = this.charm ;
    let playerW = 50 ; // for test

    // reset
    this.cloud.clear();
    this.triangle.clear();

    // 設定文字位置
    this.message.x = ( playerW - this.message.width ) / 2;
    this.message.y = -50;

    // 依據文字長度繪製雲大小
    this.cloud.beginFill(0xffffff);
    this.cloud.drawRoundedRect((playerW - this.message.width - 8) / 2, -60, this.message.width + 8, 40, 5)
    this.cloud.endFill();
    
    // 繪製箭頭
    this.triangle.beginFill(0xfffffff);
    this.triangle.drawPolygon([
        (playerW - 8 ) / 2-5, -62,             //First point
        (playerW - 8) / 2 +5, -62,              //Second point
        (playerW - 8) / 2 ,-40                //Third point
    ]);
    this.triangle.endFill(); // Fill shape's color
    this.triangle.x = 5;
    this.triangle.y = 40;

    // 聊天雲叫進來
    this.cloud.alpha = 1 ;
    this.triangle.alpha = 1 ;
    this.message.alpha = 1 ;

    // 持續一段時間後聊天雲淡出
    charm.wait(3000).then( () => {
      charm.fadeOut( this.cloud, 50 );
      charm.fadeOut( this.triangle, 50 );
      charm.fadeOut( this.message, 50 );
    }) ;

  } // Show()
} // class Chat
