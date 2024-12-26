// pages/game/game.js
Page({
  data: {
    players: [], // 玩家列表
    currentRound: 0, // 当前轮次
    currentPlayer: null, // 当前选择的玩家
    cards: [], // 所有角色牌
    selectedCards: [], // 已选择的牌
    removedCard: null, // 被移除的牌
  },

  onLoad: function(options) {
    // 初始化角色牌
    const allCards = this.initializeCards();
    
    // 随机移除一张牌
    const randomIndex = Math.floor(Math.random() * allCards.length);
    const removedCard = allCards.splice(randomIndex, 1)[0];

    this.setData({
      cards: allCards,
      removedCard: removedCard,
      players: JSON.parse(options.players || '[]'),
      currentPlayer: 0 // 从第一个玩家开始
    });

    // 开始第一轮选择
    this.startFirstRound();
  },

  // 初始化角色牌
  initializeCards: function() {
    // 这里设置所有可能的角色牌
    return [
      { id: 1, name: '刺客' },
      { id: 2, name: '小偷' },
      { id: 3, name: '魔术师' },
      { id: 4, name: '国王' },
      { id: 5, name: '主教' },
      { id: 6, name: '商人' },
      { id: 7, name: '建筑师' },
      { id: 8, name: '领主' },
      { id: 9, name: '角色9' },
      { id: 10, name: '角色10' }
    ];
  },

  // 第一轮：第一个玩家从10张牌中选择
  startFirstRound: function() {
    // 显示10张牌供第一个玩家选择
    this.setData({
      currentRound: 1,
      availableCards: this.data.cards
    });
  },

  // 玩家选择角色牌
  selectCard: function(e) {
    const selectedCardIndex = e.currentTarget.dataset.index;
    const currentCards = this.data.cards;
    const selectedCard = currentCards[selectedCardIndex];

    // 记录选择
    const selectedCards = [...this.data.selectedCards];
    selectedCards[this.data.currentPlayer] = selectedCard;

    // 从可选牌中移除
    currentCards.splice(selectedCardIndex, 1);

    // 更新状态
    this.setData({
      selectedCards,
      cards: currentCards,
      currentPlayer: this.data.currentPlayer + 1
    });

    // 检查是否需要进入下一轮
    if (this.data.currentPlayer >= this.data.players.length) {
      // 游戏结束，显示结果
      this.showResults();
    }
  },

  // 显示游戏结果
  showResults: function() {
    let results = this.data.players.map((player, index) => ({
      name: player.name,
      role: this.data.selectedCards[index]
    }));

    this.setData({
      showResults: true,
      results: results,
      removedRole: this.data.removedCard
    });
  }
});