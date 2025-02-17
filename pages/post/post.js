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
	  // 点赞逻辑
	  console.log('点赞成功');
	}
  })