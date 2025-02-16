Page({
	data: {
	  images: [
		'/image/hd1.png',
		'/image/hd1.png',
		'/image/hd1.png',
		'/image/hd1.png',
		'/image/hd1.png',
		'/image/hd1.png',
		'/image/hd1.png',
	  ]
	},
  
	// 返回上一页
	goBack() {
	  wx.navigateBack({
		delta: 1
	  });
	},
  
	// 点赞功能
	likePost() {
	  // 这里可以添加点赞的逻辑
	  console.log('点赞成功');
	}
  })