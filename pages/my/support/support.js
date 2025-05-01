Page({
	data: {
	  imageUrl: '/image/money.png' // 本地图片路径
	},
	saveImageToAlbum: function () {
	  wx.getSetting({
		success: (res) => {
		  if (!res.authSetting['scope.writePhotosAlbum']) {
			wx.authorize({
			  scope: 'scope.writePhotosAlbum',
			  success: () => {
				this.saveLocalImageToAlbum();
			  },
			  fail: (err) => {
				console.error('用户拒绝授权保存到相册', err);
				wx.showToast({
				  title: '未授权保存到相册',
				  icon: 'none'
				});
			  }
			});
		  } else {
			this.saveLocalImageToAlbum();
		  }
		}
	  });
	},
	saveLocalImageToAlbum: function () {
	  wx.saveImageToPhotosAlbum({
		filePath: this.data.imageUrl,
		success: () => {
		  wx.showToast({
			title: '保存成功',
			icon: 'success'
		  });
		},
		fail: (err) => {
		  console.error('保存图片失败', err);
		  wx.showToast({
			title: '保存失败',
			icon: 'none'
		  });
		}
	  });
	},
	// 转发逻辑
	onShareAppMessage: function () {
	  return {
		title: '分享图片',
		path: '/pages/my/support/support', 
		imageUrl: this.data.imageUrl // 转发的图片
	  };
	}
  });