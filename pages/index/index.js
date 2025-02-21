Page({
	data: {
	  // 存储帖子数据
	  posts: [
		{
		  post_id: 1,
		  avatar: '/image/hd1.png',
		  username: '用户名1',
		  post_time: '2024-10-01 12:00',
		  title: '帖子标题1',
		  content: '点进去看不到内容，目前post页面内容只有write页面输入的才能传输',
		  images: ['/image/money.png'],
		  video: '',
		  likes_count: 10,
		  comments_count: 5,
		  isLiked: false
		},
		{
		  post_id: 2,
		  avatar: '/image/hd1.png',
		  username: '用户名2',
		  post_time: '2024-10-02 13:30',
		  title: '帖子标题2',
		  content: '长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试',
		  images: ['/image/hd1.png', '/image/hd1.png', '/image/hd1.png', '/image/hd1.png', '/image/money.png', '/image/hd1.png', '/image/hd1.png', '/image/hd1.png', '/image/hd1.png'],
		  video: '',
		  likes_count: 20,
		  comments_count: 8,
		  isLiked: false
		},
		{
		  post_id: 3,
		  avatar: '/image/hd1.png',
		  username: '用户名3',
		  post_time: '2024-10-03 14:45',
		  title: '帖子标题3',
		  content: '帖子正文3',
		  images: [],
		  video: '/image/1.mp4',
		  likes_count: 15,
		  comments_count: 6,
		  isLiked: false
		}
	  ],
	  // 金刚区导航列表
	  kingkongList: [
		{ icon: '/image/hd1.png', text: '帖子预览', url: '/pages/post/post' },
		{ icon: '/image/btnbar/gr1.png', text: '表白墙', url: '/pages/index/confession/confession' },
		{ icon: '/image/btnbar/gr1.png', text: '学习互助', url: '/pages/index/study/study' },
		{ icon: '/image/btnbar/gr1.png', text: '扩列专区', url: '/pages/index/kuolie/kuolie' },
		{ icon: '/image/btnbar/gr1.png', text: '失物招领', url: '/pages/index/lost/lost' }
	  ]
	},
  
	onReady() {
	  const query = wx.createSelectorQuery();
	  query.selectAll('.post-preview').boundingClientRect((rects) => {
		rects.forEach((rect, index) => {
		  const postContentQuery = wx.createSelectorQuery();
		  postContentQuery.select(`.post-preview:nth-child(${index + 1}) .post-content`).boundingClientRect((postContentRect) => {
			const mediaPreviewQuery = wx.createSelectorQuery();
			mediaPreviewQuery.select(`.post-preview:nth-child(${index + 1}) .media-preview`).fields({
			  size: true,
			  rect: true
			}, (mediaPreviewRect) => {
			  if (postContentRect && mediaPreviewRect) {
				const marginTop = postContentRect.bottom - mediaPreviewRect.top + 20; // 20 为额外的间距
				const style = `margin-top: ${marginTop}px;`;
				const posts = this.data.posts;
				posts[index].mediaPreviewStyle = style;
				this.setData({
				  posts
				});
			  }
			}).exec();
		  }).exec();
		});
	  }).exec();
	},
  
	// 处理金刚区导航跳转
	navigateToPage(e) {
	  const url = e.currentTarget.dataset.url;
	  if (url) {
		wx.navigateTo({
		  url: url,
		  success: () => {
			console.log('页面跳转成功');
		  },
		  fail: (err) => {
			console.error('页面跳转失败:', err);
		  }
		});
	  }
	},
  
	// 跳转到帖子详情页
	navigateToPost(e) {
	  const post = e.currentTarget.dataset.post;
	  const postStr = JSON.stringify(post);
	  wx.navigateTo({
		url: `/pages/post/post?post=${postStr}`,
		success: () => {
		  console.log('跳转到帖子详情页成功');
		},
		fail: (err) => {
		  console.error('跳转到帖子详情页失败:', err);
		}
	  });
	},
  
	// 点赞/取消点赞功能
	toggleLike(e) {
	  // 阻止默认跳转行为
	  e.stopPropagation(); 
	  const index = e.currentTarget.dataset.index;
	  const posts = this.data.posts;
	  const post = posts[index];
	  post.isLiked = !post.isLiked;
	  if (post.isLiked) {
		post.likes_count++;
	  } else {
		post.likes_count--;
	  }
	  this.setData({
		posts: posts
	  });
	},
  
	// 单张图片预览
	previewSingleImage(e) {
	  const image = e.currentTarget.dataset.image;
	  wx.previewImage({
		current: image,
		urls: [image],
		success: () => {
		  console.log('单张图片预览成功');
		},
		fail: (err) => {
		  console.error('单张图片预览失败:', err);
		}
	  });
	},
  
	// 多张图片预览
	previewMultiImage(e) {
	  const current = e.currentTarget.dataset.images[e.currentTarget.dataset.index];
	  const urls = e.currentTarget.dataset.images;
	  wx.previewImage({
		current: current,
		urls: urls,
		success: () => {
		  console.log('多张图片预览成功');
		},
		fail: (err) => {
		  console.error('多张图片预览失败:', err);
		}
	  });
	},
  
	// 视频播放（可根据需求扩展功能）
	playVideo(e) {
	  const videoContext = wx.createVideoContext(e.currentTarget.id);
	  videoContext.play();
	}
  })
