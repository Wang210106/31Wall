import { formatDateString } from '../../utils/timeStamp'

Page({
	data: {
	  // 存储帖子数据
      posts: [],
      chunkPosts: [],
	  // 金刚区导航列表
	  kingkongList: [
		{ icon: '/image/btnbar/gr1.png', text: '表白墙', url: '/pages/index/confession/confession' },
		{ icon: '/image/btnbar/gr1.png', text: '学习互助', url: '/pages/index/study/study' },
		{ icon: '/image/btnbar/gr1.png', text: '扩列', url: '/pages/index/kuolie/kuolie' },
		{ icon: '/image/btnbar/gr1.png', text: '失物招领', url: '/pages/index/lost/lost' }
      ],
      currentPage: 0,
      nomore: true,
      showBackTop: false,
	},
  
	async onReady() {
        const page0 = await this.getPosts(0)

        this.setData({
            chunkPosts : [ page0 ],
            posts : page0
        })
    },
    
    async onReachBottom(){
        const cuPage = this.data.currentPage

        const pageNext = await this.getPosts(cuPage + 1)
        const newChunkPosts = this.data.chunkPosts;
        const newPageObj = []

        if (!pageNext){
            const newPage = await this.getPosts(cuPage)

            newChunkPosts[cuPage] = newPage
            newChunkPosts.forEach((value, index, array) => {
                newPageObj.push(...value)
            })

            this.setData({
                currentPage : cuPage,
                chunkPosts : newChunkPosts,
                posts : newPageObj,
            })

            console.log(this.data)
            return
        }
            
        newChunkPosts[cuPage + 1] = pageNext

        newChunkPosts.forEach((value, index, array) => {
            newPageObj.push(...value)
        })

        this.setData({
            currentPage : cuPage + 1,
            chunkPosts : newChunkPosts,
            posts : newPageObj,
        })
        console.log(this.data)
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

        if (res.statusCode !== 200){
            return null;
        }

        const postsPromises = res.data.map(async data => {
            const thisData = {
                post_id: data.post_id,
                title: data.title,
                content: data.content,
                avatar: '',//默认
                images: JSON.parse(data.images),
                post_time: formatDateString(data.created_at),
                isLiked: false,
                likes_count: 0, // 默认值
                comments_count: 0, 
                isLiked: false
            };
         
            const [likeResult, commentResult, userInfoResult] = await Promise.all([
                this.getLikeAmount(data.post_id),
                this.getCommentAmount(data.post_id),
                this.getUserById(data.user_id)
            ]);
         
            thisData.likes_count = likeResult.data[0]['COUNT(*)'];
            thisData.comments_count = commentResult.data[0]['COUNT(*)'];

            if (data.realname == 1){
                thisData.avatar = userInfoResult.data.avatar_url
                thisData.username = userInfoResult.data.nickname
            }

            return thisData;
        })

        return await Promise.all(postsPromises);
    },
  
    getLikeAmount(postid){
        return wx.cloud.callContainer({
            "config": {
            "env": "prod-9ggzinxb5b8ff0c5"
            },
            "path": "/post/like/amount?postid="+postid,
            "header": {
            "X-WX-SERVICE": "express-41pr"
            },
            "method": "GET",
        })
    },

    getCommentAmount(postid){
        return wx.cloud.callContainer({
            "config": {
            "env": "prod-9ggzinxb5b8ff0c5"
            },
            "path": "/post/comment/amount?postid="+postid,
            "header": {
            "X-WX-SERVICE": "express-41pr"
            },
            "method": "GET",
        })
    },

    getUserById(userid){
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

    onPageScroll(e) {
        if (e.scrollTop > 300){
            this.setData({
                showBackTop: true
            })
        } else {
            this.setData({
                showBackTop: false
            })
        }
    },

    backToTop(){
        wx.pageScrollTo({
            scrollTop: 0,
            duration: 1000
        })
    },

})
