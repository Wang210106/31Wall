import { formatDateString } from '../../utils/timeStamp'

Page({
    data: {
        // 存储帖子数据
        posts: [],
        // 金刚区导航列表
        kingkongList: [
            { id: 0, icon: 'icon-biaobaiqiangpinglunqudianzan', text: '表白墙', url: '表白墙捏：' },
            { id: 1, icon: 'icon-zizhuxuexi', text: '学习互助', url: '学习学习捏：' },
            { id: 2, icon: 'icon-a-ziyuan5', text: '扩列', url: '扩列捏：' },
            { id: 3, icon: 'icon-shiwuzhaoling', text: '失物招领', url: '失物招领捏：' }
        ],

        currentPage: 0,
        nomore: true,
        initializing: true,
        
        //回顶图标
        showBackTop: false,
        
        kStatus: -1,
        subtitle: '正文捏：',
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
        currentPage: 0,
        kStatus: -1,
        subtitle: '正文捏：',
    })
  },

  async onShow() {
    if (this.data.initializing) return

    const page0 = await this.getPosts(0)

    this.setData({
        posts: page0,
        currentPage: 0,
        currentPage: 0,
        kStatus: -1,
        subtitle: '正文捏：',
    })
  },

  //到底了
  async onReachBottom() {
    if (this.data.loading) return

    this.setData({
      loading: true,
    })

    const cuPage = this.data.currentPage
    //检查是否在tab状态
    const pageNext = []
    if (this.data.kStatus < 0){
        pageNext[0] = await this.getPosts(cuPage + 1)
    }
    else{
        pageNext[0] = await this.getPostsByTab(this.data.kingkongList[this.data.kStatus].text,cuPage + 1)
        pageNext[0] = this.updatePostsData(pageNext[0].data)
    }

    this.setData({
        currentPage: cuPage + 1,
        posts: pageNext[0],
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

    const postsPromises = this.updatePostsData(res.data)

    return await Promise.all(postsPromises);
  },

  //下拉刷新
  onPullDownRefresh: async function () {
    wx.showNavigationBarLoading();

    const page0 = await this.getPosts(0)

    this.setData({
        posts: page0,
        currentPage: 0,
        kStatus: -1,
        subtitle: '正文捏：',
    })

    setTimeout(() => {
      wx.stopPullDownRefresh();
      wx.hideNavigationBarLoading();
    }, 1000);
  },

  // 处理金刚区导航跳转
    async navigateToPage(e) {
        const { url, id } = e.currentTarget.dataset;

        //不在查看tab
        if (this.data.kStatus < 0){
            this.setData({
                currentPage: 0,
            })
        }
        else{
            this.setData({
                currentPage: this.data.currentPage + 1
            })
        }

        const res = await this.getPostsByTab(this.data.kingkongList[id].text, this.data.currentPage)
        const postsdata = this.updatePostsData(res.data)

        this.setData({
            subtitle: url,
            kStatus: id,
            posts: postsdata,
        })
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
        wx.navigateTo({
            url: '/pages/write/write',
        });
  },

  updatePostsData: data => data.map(data => {
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

        const userInfoResult = data.userInfo

        //昵称实名
        if (data.realname == 1) {
            thisData.avatar = userInfoResult.avatar_url
            thisData.username = userInfoResult.nickname
        }
        //全实名
        else if (data.realname == 2){
            thisData.avatar = userInfoResult.avatar_url
            thisData.username = userInfoResult.grade + '' + 
            (userInfoResult.class <= 9 ? '0' + userInfoResult.class : userInfoResult.class)
            + userInfoResult.realname
        }

        return thisData;
    }),

  getLikeAmount(postid) {
    return wx.cloud.callContainer({
      "config": {
        "env": "prod-9ggzinxb5b8ff0c5"
      },
      "path": "/post/like/amount?postid=" + postid,
      "header": {
        "X-WX-SERVICE": "express-41pr"
      },
      "method": "GET",
    })
  },

  getCommentAmount(postid) {
    return wx.cloud.callContainer({
      "config": {
        "env": "prod-9ggzinxb5b8ff0c5"
      },
      "path": "/post/comment/amount?postid=" + postid,
      "header": {
        "X-WX-SERVICE": "express-41pr"
      },
      "method": "GET",
    })
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

  getPostsByTab(tab, page) {
    return wx.cloud.callContainer({
      "config": {
        "env": "prod-9ggzinxb5b8ff0c5"
      },
      "path": "/post/tab?tab=" + encodeURIComponent(tab) + '&page=' + page,
      "header": {
        "X-WX-SERVICE": "express-41pr"
      },
      "method": "GET",
    })
  },
})
