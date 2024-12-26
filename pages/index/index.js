Page({
  data: {
    userInfo: {
      avatarUrl: '',
      nickName: '',
    },
    hasUserInfo: false,
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
  },
  
  // 添加创建房间的处理函数
  createRoom() {
    wx.navigateTo({
      url: '../room/room',  // 跳转到房间页面
    })
  }
});
