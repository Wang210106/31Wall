import { formatDateString } from '../../utils/timeStamp';
import { 
  getPosts,
  getPostsByTab,
  postLike,
  deleteLike,
  getLikeAmount,
  getUserInfo
} from '../../utils/netRequest';

Page({
  data: {
    posts: [],
    kingkongList: [],
    selfLike: [],
    currentPage: 0,
    
    showBackTop: false,
    kStatus: -1, // -1表示主页，其他值表示对应分区ID
    
    nomore: false,
    initializing: true,
    loading: false,
    loadingPage: false, // 页面加载状态
    
    showTabBar: false, // 是否显示下滑后的分区导航栏
    navHeight: 44, // 导航栏高度，默认44px
    statusBarHeight: 0, // 状态栏高度
  },

  onLoad: function() {
    const app = getApp();
    this.setData({
      kingkongList: app.globalData.kingkongList,
      selfLike: wx.getStorageSync('self_like') || [],
    });
    
    // 获取系统信息，确定状态栏和导航栏高度
    wx.getSystemInfo({
      success: (res) => {
        const statusBarHeight = res.statusBarHeight;
        const isIOS = res.system.indexOf('iOS') > -1;
        const navHeight = isIOS ? 44 : 48; // iOS和Android导航栏高度可能不同
        
        // 设置状态栏高度
        this.setData({
          statusBarHeight,
          navHeight: statusBarHeight + navHeight,
        });
        
        // 设置CSS变量
        wx.setNavigationBarColor({
          frontColor: '#000000',
          backgroundColor: '#ffffff',
        });
        
        // 设置导航栏样式
        wx.setNavigationBarTitle({
          title: '三十一中墙'
        });
      },
    });
  },

  // 轮播图跳转
  handleImageTap: function(event) {
    const targetUrl = event.currentTarget.dataset.url;
    wx.navigateTo({
      url: targetUrl,
      success: () => console.log('页面跳转成功'),
      fail: (err) => console.log('页面跳转失败', err)
    });
  },

  async onReady() {
    const page0 = await this.fetchPosts(0);
    this.setData({
      posts: page0,
      initializing: false,
      currentPage: 0,
      kStatus: -1,
    });
  },

  async onShow() {
    if (this.data.initializing) return;
    const page0 = await this.fetchPosts(0);
    this.setData({
      posts: page0,
      currentPage: 0,
      kStatus: -1,
    });
  },

  // 处理金刚区导航跳转
  async navigateToPage(e) {
    const { id } = e.currentTarget.dataset;
    const tabName = this.data.kingkongList[id].text;
    
    // 修改导航栏样式
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#007aff',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    });
    
    // 修改导航栏标题
    wx.setNavigationBarTitle({
      title: tabName
    });
    
    // 显示加载提示
    this.setData({ loadingPage: true });
    
    try {
      const res = await getPostsByTab(tabName, 0);
      const postsdata = await this.processPostsData(res.data);
      
      this.setData({
        kStatus: id,
        currentPage: 0,
        posts: postsdata,
      });
    } catch (error) {
      console.error('获取分区数据失败:', error);
      wx.showToast({ title: '加载失败', icon: 'none' });
    } finally {
      // 隐藏加载提示
      this.setData({ loadingPage: false });
    }
  },

  // 从分页回主页
  async toMainPage() {
    // 显示加载提示
    this.setData({ loadingPage: true });
    
    try {
      // 恢复导航栏样式
      wx.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: '#ffffff',
        animation: {
          duration: 400,
          timingFunc: 'easeIn'
        }
      });
      
      // 恢复导航栏标题
      wx.setNavigationBarTitle({
        title: '三十一中墙'
      });
      
      const page0 = await this.fetchPosts(0);
      this.setData({
        posts: page0,
        currentPage: 0,
        kStatus: -1,
      });
    } catch (error) {
      console.error('返回主页失败:', error);
      wx.showToast({ title: '加载失败', icon: 'none' });
    } finally {
      // 隐藏加载提示
      this.setData({ loadingPage: false });
    }
  },

  // 到底加载更多
  async onReachBottom() {
    if (this.data.loading || this.data.nomore) return;
    
    this.setData({ loading: true });
    const nextPage = this.data.currentPage + 1;
    
    let newPosts = [];
    if (this.data.kStatus < 0) {
      newPosts = await this.fetchPosts(nextPage);
    } else {
      const tabName = this.data.kingkongList[this.data.kStatus].text;
      const res = await getPostsByTab(tabName, nextPage);
      newPosts = await this.processPostsData(res.data);
    }
    
    // 检查是否还有更多数据
    const nomore = newPosts.length === 0;
    
    this.setData({
      currentPage: nextPage,
      posts: [...this.data.posts, ...newPosts],
      loading: false,
      nomore,
    });
  },

  // 下拉刷新
  async onPullDownRefresh() {
    wx.showNavigationBarLoading();
    let page0 = [];
    
    if (this.data.kStatus < 0) {
      page0 = await this.fetchPosts(0);
    } else {
      const tabName = this.data.kingkongList[this.data.kStatus].text;
      const res = await getPostsByTab(tabName, 0);
      page0 = await this.processPostsData(res.data);
    }
    
    this.setData({
      posts: page0,
      currentPage: 0,
      nomore: false,
    });
    
    setTimeout(() => {
      wx.stopPullDownRefresh();
      wx.hideNavigationBarLoading();
    }, 1000);
  },

  // 获取并处理帖子数据
  async fetchPosts(page) {
    const res = await getPosts(page);
    if (res.statusCode !== 200) return [];
    return this.processPostsData(res.data);
  },

  // 处理帖子数据（异步获取用户信息）
  async processPostsData(posts) {
    const processedPosts = [];
    
    for (const post of posts) {
      // 获取用户信息
      let userInfo = {};
      if (post.user_id) {
        try {
          const userRes = await getUserInfo(post.user_id);
          userInfo = userRes.data || {};
        } catch (error) {
          console.error('获取用户信息失败:', error);
        }
      }
      
      const thisData = this.formatPostData(post, userInfo);
      processedPosts.push(thisData);
    }
    
    return processedPosts;
  },

  // 格式化帖子数据
  formatPostData(post, userInfo) {
    const formatted = {
      post_id: post.post_id,
      title: post.title,
      content: post.content,
      images: JSON.parse(post.images || '[]'),
      post_time: formatDateString(post.created_at),
      likes_count: post.likeAmount || 0,
      comments_count: post.commentAmount || 0,
      realname: post.realname,
      user_id: post.user_id,
      tab: post.tab,
    };
    
    // 处理媒体预览样式
    if (formatted.images.length === 1) {
      formatted.mediaPreviewStyle = 'height: 200px;';
    } else if (formatted.images.length > 1) {
      formatted.mediaPreviewStyle = 'height: 200px;';
    } else {
      formatted.mediaPreviewStyle = 'display: none;';
    }
    
    // 处理实名信息
    if (post.realname == 1) {
      formatted.avatar = userInfo.avatar_url;
      formatted.username = userInfo.nickname;
    } else if (post.realname == 2) {
      formatted.avatar = userInfo.avatar_url;
      formatted.username = `${userInfo.grade}${userInfo.class.toString().padStart(2, '0')}${userInfo.realname}`;
    }
    
    return formatted;
  },

  // 点赞功能
  async pageLike(e) {
    const userid = wx.getStorageSync('user_info')?.userid;
    const postid = e.currentTarget.dataset.id;
    
    if (!userid) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }
    
    const selfLikes = wx.getStorageSync('self_like') || [];
    const isLiked = selfLikes.includes(postid);
    
    try {
      if (isLiked) {
        // 取消点赞
        await deleteLike(postid, userid);
        const newLikes = selfLikes.filter(id => id !== postid);
        wx.setStorageSync('self_like', newLikes);
      } else {
        // 点赞
        await postLike({ userid, postid });
        wx.setStorageSync('self_like', [...selfLikes, postid]);
      }
      
      // 更新点赞数
      const likeRes = await getLikeAmount(postid);
      const newCount = likeRes.data[0]?.['COUNT(*)'] || 0;
      
      this.setData({
        posts: this.data.posts.map(post => 
          post.post_id === postid ? {...post, likes_count: newCount} : post
        ),
        selfLike: wx.getStorageSync('self_like'),
      });
      
    } catch (error) {
      console.error('点赞操作失败:', error);
      wx.showToast({ title: '操作失败', icon: 'none' });
    }
  },

  // 页面滚动事件处理
  onPageScroll(e) {
    // 添加导航栏高度的偏移量
    const scrollThreshold = 300 + this.data.statusBarHeight;
    
    // 确保导航栏在下滑到一定距离后显示
    this.setData({ 
      showBackTop: e.scrollTop > 800,
      showTabBar: e.scrollTop > scrollThreshold
    });
  },

  backToTop() {
    wx.pageScrollTo({ scrollTop: 0, duration: 1000 });
  },

  handleFloatingBtnTap() {
    wx.navigateTo({ 
      url: '/pages/write/write' 
    });
  }
});