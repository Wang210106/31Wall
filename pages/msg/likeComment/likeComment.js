// pages/msg/likeComment/likeComment.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
	  messages: [
		// 这里可以添加一些初始的模拟消息数据
		{
		  id: 1,
		  avatar: '/image/hd1.png',
		  name: '用户1',
		  time: '2025-02-03 10:00',
		  content: '这是一条点赞评论消息示例'
		},
		{
		  id: 2,
		  avatar: '/image/hd1.png',
		  name: '用户2',
		  time: '2025-02-03 11:30',
		  content: '另一条点赞评论消息示例'
		}
	  ]
	},
  
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
	  // 可以在这里进行一些初始化操作，比如从缓存或接口获取消息数据
	},
  
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady() {
  
	},
  
	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow() {
  
	},
  
	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide() {
  
	},
  
	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload() {
  
	},
  
	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh() {
	  // 下拉刷新逻辑，比如重新获取消息数据
	  wx.showLoading({
		title: '刷新中...',
	  });
	  // 模拟刷新数据，这里可以替换为实际的接口请求
	  setTimeout(() => {
		// 假设重新获取到了新的消息数据
		const newMessages = [
		  {
			id: 3,
			avatar: '/image/hd1.png',
			name: '用户3',
			time: '2025-02-03 12:00',
			content: '下拉刷新后获取的新消息'
		  }
		];
		this.setData({
		  messages: newMessages
		});
		wx.stopPullDownRefresh();
		wx.hideLoading();
	  }, 1000);
	},
  
	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom() {
	  // 上拉加载更多逻辑，比如加载更多消息数据
	  wx.showLoading({
		title: '加载中...',
	  });
	  // 模拟加载更多数据，这里可以替换为实际的接口请求
	  setTimeout(() => {
		const newMessages = [
		  {
			id: 4,
			avatar: '/image/hd1.png',
			name: '用户4',
			time: '2025-02-03 13:00',
			content: '上拉加载更多的消息'
		  }
		];
		const currentMessages = this.data.messages;
		this.setData({
		  messages: currentMessages.concat(newMessages)
		});
		wx.hideLoading();
	  }, 1000);
	},
  
	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage() {
	  return {
		title: '我收到的点赞&评论',
		path: '/pages/msg/likeComment/likeComment'
	  };
	},
  
	/**
	 * 消息项点击处理函数
	 */
	handleMessageTap: function (e) {
		const index = e.currentTarget.dataset.index;
		if (index!== undefined && index < this.data.messages.length) {
		  const message = this.data.messages[index];
		  console.log('点击了消息项', message);
		  wx.navigateTo({
			url: `/pages/msg/likeCommentDetail/likeCommentDetail?id=${message.id}`
		  });
		} else {
		  console.error('无效的消息索引', index);
		}
	  }
  });