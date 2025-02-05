Page({
	data: {
	  systemBadge: 0,
	  updateBadge: 0,
	  likeCommentBadge: 1,
	  hasEnteredLikeComment: false // 新增，用于标记是否进入过点赞&评论页面
	},
	navigateToMessages: function (e) {
	  let type = e.currentTarget.dataset.type;
	  if (type === 'likeComment') {
		wx.navigateTo({
		  url: '/pages/msg/likeComment/likeComment'
		});
		this.setData({
		  likeCommentBadge: 0,
		  hasEnteredLikeComment: true,
		});
	  } else {
		console.log('跳转到', type, '消息详情页面');
	  }
	},

	addMessage: function (type) {
	  if (type ==='system') {
		this.setData({
		  systemBadge: Math.min(this.data.systemBadge + 1, 99)
		});
	  } else if (type === 'update') {
		this.setData({
		  updateBadge: Math.min(this.data.updateBadge + 1, 99)
		});
	  } else if (type === 'likeComment') {
		if (!this.data.hasEnteredLikeComment) {
		  this.setData({
			likeCommentBadge: Math.min(this.data.likeCommentBadge + 1, 99)
		  });
		}
	  }
	}
  });