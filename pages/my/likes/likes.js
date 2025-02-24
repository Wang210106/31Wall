// pages/my/likes/likes.js
Page({
    data: {
        "items" : [],
        SQLdata: [],
    },
    itemtap: e => {
        const id = e.detail.type;
        console.log("To " + id)
    },
    onLoad: function(options) {
        //console.log(options.type)
        const { userid } = wx.getStorageSync('user_info')

        const methodDic = {
            'posts' : this.getPostsByUserid,
            'likes' : this.getLikesByUserid,
            'comments' : this.getCommentsByUserid,
        }

        methodDic[options.type](userid)
        .then(res => res.data)
        .then(data => {
            const itemData = data.map(SQLitem => ({
                id : SQLitem.post_id,
                text : SQLitem.title || '校园帖子' ,
                subText : SQLitem.content,
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