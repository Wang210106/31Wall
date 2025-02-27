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

      selfliks: [],
	},
  
	async onReady() {
        const page0 = await this.getPosts(0)

        this.setData({
            chunkPosts : [ page0 ],
            posts : page0
        })

        const selfLikeLists = await this.getLikeByUserid(wx.getStorageSync('user_info').userid)

        wx.setStorageSync('self_like', selfLikeLists.data.result.map(value => value.post_id))
    },

    async onShow(){
        const { chunkPosts } = this.data

        const processedChunks = await Promise.all(chunkPosts.map(async chunk => {
            const processedInnerValues = await Promise.all(chunk.map(async innerValue => {
                const [likeResult, commentResult] = await Promise.all([
                    this.getLikeAmount(innerValue.post_id),
                    this.getCommentAmount(innerValue.post_id),
                ]);
     
                // 创建一个新对象以避免直接修改原始对象
                const newInnerValue = { ...innerValue };
                newInnerValue.likes_count = likeResult.data[0]['COUNT(*)'];
                newInnerValue.comments_count = commentResult.data[0]['COUNT(*)'];
     
                return newInnerValue;
            }));
     
            return processedInnerValues;
        }));

        this.setData({
            chunkPosts: processedChunks,
            posts: processedChunks.flat(),
        })
    },
    
    async onReachBottom(){
        const cuPage = this.data.currentPage
        const pageNext = await this.getPosts(cuPage + 1)

        const newChunkPosts = this.data.chunkPosts;
        const newPageObj = []

        if (!pageNext){
            const newPage = await this.getPosts(cuPage)
            //console.log(newPage)

            newChunkPosts[cuPage] = newPage
            newChunkPosts.forEach((value, index, array) => {
                newPageObj.push(...value)
            })

            this.setData({
                currentPage : cuPage,
                chunkPosts : newChunkPosts,
                posts : newPageObj,
            })

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
                images: JSON.parse(data.images),
                post_time: formatDateString(data.created_at),
                isLiked: false,
                likes_count: 0, // 默认值
                comments_count: 0, 
                realname: data.realname,
                user_id: data.user_id,
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

    getLikeByUserid (userid){
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
        if (e.scrollTop > 800){
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
