// pages/room/room.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    roomId: '', // 房间ID
    players: new Array(8).fill({}),  // 初始化8个空位置
    isCreator: false, // 是否是房主
    isReady: false,  // 添加准备状态
    canStart: false  // 是否可以开始游戏
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.roomId) {
      this.setData({
        roomId: options.roomId,
        isCreator: false
      });
      this.joinRoom();
    } else {
      const roomId = 'room_' + Date.now();
      this.setData({
        roomId: roomId,
        isCreator: true
      });
      this.createRoom();
    }
  },

  createRoom() {
    this.setData({
      players: [
        { id: 1, name: '房主', isReady: true }, // 房主默认准备
        ...new Array(7).fill({})
      ]
    });
    this.checkAllReady(); // 检查是否可以开始游戏
  },

  joinRoom() {
    const players = [...this.data.players];
    const emptyIndex = players.findIndex(player => !player.id);
    
    if (emptyIndex !== -1) {
      players[emptyIndex] = {
        id: emptyIndex + 1,
        name: `玩家${emptyIndex}`,
        isReady: false
      };
      this.setData({ players });
      this.checkAllReady(); // 检查是否可以开始游戏
    } else {
      wx.showToast({
        title: '房间已满',
        icon: 'none'
      });
    }
  },

  // 切换准备状态（仅非房主）
  toggleReady: function() {
    if (this.data.isCreator) return;
    
    const isReady = !this.data.isReady;
    this.setData({ isReady });
    
    // 更新玩家准备状态
    const players = [...this.data.players];
    const playerIndex = players.findIndex(p => p.id === this.data.currentPlayerId);
    if (playerIndex !== -1) {
      players[playerIndex].isReady = isReady;
      this.setData({ players });
    }

    // 检查是否所有玩家都准备好了
    this.checkAllReady();
  },

  // 检查所有玩家是否都准备好
  checkAllReady: function() {
    const players = this.data.players;
    const activePlayers = players.filter(p => p.id); // 获取所有已加入的玩家
    //const allReady = activePlayers.length > 1 && // 至少需要2个玩家
     //                activePlayers.slice(1).every(p => p.isReady); // 除房主外所有玩家都准备好了

    const allReady = activePlayers.length > 0; 

    this.setData({
      canStart: allReady
    });
  },

  // 开始游戏（仅房主）
  startGame: function() {
    if (!this.data.canStart) {
      wx.showToast({
        title: '等待其他玩家准备',
        icon: 'none'
      });
      return;
    }

    // 跳转到游戏页面，并传递玩家信息
    wx.navigateTo({
      url: `/pages/game/game?players=${JSON.stringify(this.data.players)}`
    });
  },

  // 邀请按钮点击事件
  onShare: function() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage']
    });
  },

  // 自定义分享内容
  onShareAppMessage: function() {
    return {
      title: '来和我一起玩游戏吧！',
      path: `/pages/room/room?roomId=${this.data.roomId}`, // 携带房间ID
      imageUrl: '/images/share-img.png'  // 分享图片
    };
  }
})