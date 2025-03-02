import { formatDateString } from '../../utils/timeStamp'

Page({
    data: {
        // 存储帖子数据
        posts: [],
        chunkPosts: [],
        // 金刚区导航列表
        kingkongList: [
            { icon: 'icon-biaobaiqiangpinglunqudianzan', text: '表白墙' },
            { icon: 'icon-zizhuxuexi', text: '学习互助' },
            { icon: 'icon-a-ziyuan5', text: '扩列' },
            { icon: 'icon-shiwuzhaoling', text: '失物招领' }
        ],
        currentPage: 0,
        nomore: true,
        showBackTop: false,
        initializing: true,
        loading: false,
        floatingBtnIcon: '/image/btnbar/tiezi0.png' // 悬浮窗按钮初始图标
    },

  // 轮播图跳转
  handleImageTap: function (event) {
    const targetUrl = event.currentTarget.dataset.url;
    wx.navigateTo({
      url: targetUrl,
      success: function () {
        console.log('页面跳转成功');
      },
      fail: function (err) {
        console.log('页面跳转失败', err);
      }
    });
  },

  async onReady() {
    const page0 = await this.getPosts(0)

    this.setData({
      posts: page0,
      initializing: false,
    })
  },

  async onShow() {
    if (this.data.initializing) return

    const page0 = await this.getPosts(0)

    this.setData({
      posts: page0,
      currentPage: 0,
    })
  },

  async onReachBottom() {
    if (this.data.loading) return

    this.setData({
      loading: true,
    })

    const cuPage = this.data.currentPage
    const pageNext = await this.getPosts(cuPage + 1)

    this.setData({
      currentPage: cuPage + 1,
      posts: pageNext,
    })

    setTimeout(() => {
      this.setData({
        loading: false,
      })
    }, 1500); // 1.5秒之后才能刷新
  },

  async getPosts(page) {
    const res = await wx.cloud.callContainer({
      "config": {
        "env": "prod-9ggzinxb5b8ff0c5"
      },
      "path": "/post/all?page=" + page,
      "header": {
        "X-WX-SERVICE": "express-41pr"
      },
      "method": "GET",
    })

    if (res.statusCode !== 200) {
      return null;
    }

    const postsPromises = res.data.map(async data => {
      const thisData = {
        post_id: data.post_id,
        title: data.title,
        content: data.content,
        images: JSON.parse(data.images),
        post_time: formatDateString(data.created_at),
        isLiked: false,
        likes_count: data.likeAmount, 
        comments_count: data.commentAmount,
        realname: data.realname,
        user_id: data.user_id,
        tab: data.tab,
      };

      if (data.realname == '1') {
        thisData.avatar = data.userInfo.avatar_url 
        thisData.username = data.userInfo.nickname
      }
      else if (data.realname == '2') {
        const classNum = data.userInfo.class < 10 ? '0' + data.userInfo.class : data.userInfo.class

        thisData.avatar = data.userInfo.avatar_url 
        thisData.username = data.userInfo.grade + '' + classNum + ' ' +  data.userInfo.realname
      }

      return thisData;
    })

    return await Promise.all(postsPromises);
  },

  onPullDownRefresh: async function () {
    wx.showNavigationBarLoading();

    const page0 = await this.getPosts(0)

    this.setData({
      posts: page0,
      currentPage: 0,
    })

    setTimeout(() => {
      wx.stopPullDownRefresh();
      wx.hideNavigationBarLoading();
    }, 1000);
  },

  getUserById(userid) {
    return wx.cloud.callContainer({
      "config": {
        "env": "prod-9ggzinxb5b8ff0c5"
      },
      "path": "/user/userid?userid=" + userid,
      "header": {
        "X-WX-SERVICE": "express-41pr"
      },
      "method": "GET",
    })
  },

  getLikeByUserid(userid) {
    return wx.cloud.callContainer({
      "config": {
        "env": "prod-9ggzinxb5b8ff0c5"
      },
      "path": "/post/like/userid?userid=" + userid,
      "header": {
        "X-WX-SERVICE": "express-41pr"
      },
      "method": "GET",
    })
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
    const post = this.data.posts.find(obj => obj.post_id === e.currentTarget.dataset.post);
    const postStr = JSON.stringify(post);

    wx.setStorageSync('_post', postStr)

    wx.navigateTo({
      url: `/pages/post/post`,
    });
  },

  onPageScroll(e) {
    if (e.scrollTop > 800) {
      this.setData({
        showBackTop: true
      })
    } else {
      this.setData({
        showBackTop: false
      })
    }
  },

  backToTop() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 1000
    })
  },

  // 处理悬浮窗按钮点击事件
  handleFloatingBtnTap() {
        // 记录初始图标
		const initialIcon = this.data.floatingBtnIcon;

		// 切换图标
		this.setData({
			floatingBtnIcon: this.data.floatingBtnIcon === '/image/add0.png' ? '/image/btnbar/tiezi1.png' : '/image/btnbar/tiezi0.png'
		});
	

	wx.navigateTo({
        url: '/pages/write/write',
        success: () => {
			console.log('跳转到发帖页面成功');
			this.setData({
                floatingBtnIcon: initialIcon
            });
        },
        fail: (err) => {
			console.error('跳转到发帖页面失败:', err);
			this.setData({
                floatingBtnIcon: initialIcon
            });
        }
    });
  }
})