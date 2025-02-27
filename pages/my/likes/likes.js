// pages/my/likes/likes.js
Page({
    data: {
        "items" : [],
        SQLdata: [],
    },
    itemtap: e => {
        const id = e.detail.type;
        wx.navigateTo({
            url: `/pages/post/post?postid=` + id,
        });
    },
    onLoad: async function(options) {
        //console.log(options.type)
        const { userid } = wx.getStorageSync('user_info')

        const methodDic = {
            'posts' : this.getPostsByUserid,
            'likes' : this.getLikesByUserid,
            'comments' : this.getCommentsByUserid,
        }

        await methodDic[options.type](userid)
        .then(res => res.data)
        .then(data => {
            const itemData = data.map(SQLitem => ({
                id : SQLitem.post_id,
                text : SQLitem.title.slice(0,20) || '校园帖子' ,
                subText : SQLitem.content.slice(0,20),
                imageUrl : JSON.parse(SQLitem.images)[0],
            }))

            this.setData({
                items : itemData,
                SQLdata : data
            })
        })

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

    getLikesByUserid(userid){
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

    getCommentsByUserid(userid){
        return wx.cloud.callContainer({
            "config": {
                "env": "prod-9ggzinxb5b8ff0c5"
            },
            "path": "/post/comment/userid?userid=" + userid,
            "header": {
                "X-WX-SERVICE": "express-41pr"
            },
            "method": "GET",
        })
    },
})