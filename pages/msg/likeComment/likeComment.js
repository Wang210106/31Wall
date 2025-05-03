const { formatDateString } = require("../../../utils/timeStamp");

// pages/msg/likeComment/likeComment.js
Page({
	data: {
	    messages: []
	},

    async onShow(){
        const lists = wx.getStorageSync('_lac')[2]
        lists.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        await this.update(lists)
    },

    handleMessageTap(e){
        const index = e.currentTarget.dataset.index

        wx.navigateTo({
          url: '/pages/post/post?postid=' + this.data.messages[index].post_id,
        })
    },

    async update(lists){
        const userPromises = lists.map(value => this.getUserById(value.user_id).then(res => res.data))

        const userlists = await Promise.all(userPromises)

        const itemList = lists.map((value, index, array) => ({
            id : value.like_id ? 'like' + value.like_id : 'comment' + value.comments_id,
            name : userlists[index].nickname,
            type: value.like_id ? '点赞' : '评论',
            time: formatDateString(value.created_at),
            content: userlists[index].nickname + (value.like_id ? '点赞' : '评论') + '了你的帖子',
            avatar: userlists[index].avatar_url,
            post_id: value.post_id,
        }))

        this.setData({
            messages : itemList
        })
    },

    onPullDownRefresh: async function () {
        wx.showNavigationBarLoading();
    
        const userInfo = wx.getStorageSync('user_info');
        const posts = await this.getPostsByUserid(userInfo.userid);
        const postsID = posts.data.map(post => post.post_id);
 
        const likesPromises = postsID.map(postId => 
            this.getLikesByPostid(postId).then(response => response.data.result)
        );

        const commentsPromises = postsID.map(
            postId => this.getCommentsByPostid(postId).then(response => response.data.result)
        );
 
        const likesData = await Promise.all(likesPromises);
        const commentsData = await Promise.all(commentsPromises);

        const lists = [ ...likesData, ...commentsData ].flat()
        lists.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        await this.update(lists)

        setTimeout(() => {
          wx.stopPullDownRefresh();
          wx.hideNavigationBarLoading();
        }, 1000);
    },

    getPostsByUserid(userid){
        return wx.cloud.callContainer({
            "config": {
                "env": "prod-9ggzinxb5b8ff0c5"
            },
            "path": "/post/userid?userid=" + userid,
            "header": {
                "X-WX-SERVICE": "express-41pr"
            },
            "method": "GET",
        })
    },

    getLikesByPostid(postid){
        return wx.cloud.callContainer({
            "config": {
                "env": "prod-9ggzinxb5b8ff0c5"
            },
            "path": "/post/like/postid?postid=" + postid,
            "header": {
                "X-WX-SERVICE": "express-41pr"
            },
            "method": "GET",
        })
    },

    getCommentsByPostid(postid){
        return wx.cloud.callContainer({
            "config": {
                "env": "prod-9ggzinxb5b8ff0c5"
            },
            "path": "/post/comment/postid?postid=" + postid,
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
});