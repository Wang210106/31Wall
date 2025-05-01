Page({
	data: {
	  imageUrls: ['cloud://prod-9ggzinxb5b8ff0c5.7072-prod-9ggzinxb5b8ff0c5-1340903048/activities/band/band1.jpg', 'cloud://prod-9ggzinxb5b8ff0c5.7072-prod-9ggzinxb5b8ff0c5-1340903048/activities/band/band2.jpg']
	},
	onLoad() {
	  // 页面加载时的逻辑
	},
	previewImage: function (e) {
	  const current = this.data.imageUrls[e.currentTarget.dataset.index];
	  wx.previewImage({
		current: current,
		urls: this.data.imageUrls
	  })
	}
  })