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
		kStatus: -1,

		nomore: false,
		initializing: true,
		loading: false, // 添加loading状态
	},

	onLoad: function() {
		const app = getApp();
		this.setData({
			kingkongList: app.globalData.kingkongList,
			selfLike: wx.getStorageSync('self_like') || [],
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
		
		const res = await getPostsByTab(tabName, 0);
		const postsdata = await this.processPostsData(res.data);
		
		this.setData({
		kStatus: id,
		currentPage: 0,
		posts: postsdata,
		});
	},

	// 从分页回主页
	async toMainPage() {
		const page0 = await this.fetchPosts(0);
		this.setData({
		posts: page0,
		currentPage: 0,
		kStatus: -1,
		});
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
			posts: newPosts,
			loading: false,
			nomore,
		});
	},

	// 下拉刷新
	async onPullDownRefresh() {
		wx.showNavigationBarLoading();
		const page0 = await this.fetchPosts(0);
		
		this.setData({
			posts: page0,
			currentPage: 0,
			kStatus: -1,
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
			const thisData = this.formatPostData(post, post.userInfo);
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

	// 其他方法保持不变
	navigateToPost(e) {
		const post = this.data.posts.find(obj => obj.post_id === e.currentTarget.dataset.post);
		wx.setStorageSync('_post', JSON.stringify(post));
		wx.navigateTo({ url: '/pages/post/post' });
	},

	onPageScroll(e) {
		this.setData({ showBackTop: e.scrollTop > 800 });
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