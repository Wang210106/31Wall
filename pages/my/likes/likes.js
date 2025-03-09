// pages/my/likes/likes.js
import { formatDateString, parseISODate } from '../../../utils/timeStamp'

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

        if(options.type === 'likes'){
            await this.getLikesByUserid(userid)
            .then(res => res.data.result)
            .then(data => {
                data.sort((a, b) => parseISODate(b.created_at) - parseISODate(a.created_at))

                const itemData = data.map(SQLitem => {
                    return {
                        id : SQLitem.post_id,
                        text : '一条点赞',
                        subText : formatDateString(SQLitem.created_at),
                        imageUrl : '/image/hd1.png',
                    }
                })

                this.setData({
                    items : itemData,
                    SQLdata : data
                })
            })
        }
        if(options.type === 'comments'){
            await this.getCommentsByUserid(userid)
            .then(res => res.data.result)
            .then(data => {
                const itemData = data.map(SQLitem => {
                    return {
                        id : SQLitem.post_id,
                        text : '一条评论',
                        subText : SQLitem.comment,
                        imageUrl : wx.getStorageSync('user_info').avatar_url,
                    }
                })

                this.setData({
                    items : itemData,
                    SQLdata : data
                })
            })
        }
        else if(options.type === 'posts'){
            await this.getPostsByUserid(userid)
            .then(res => res.data)
            .then(data => {
                console.log(data.sort((a, b) => parseISODate(b.created_at) - parseISODate(a.created_at)))

                const itemData = data.map(SQLitem => {
                    const imageUrl = JSON.parse(SQLitem.images).length > 0 ? JSON.parse(SQLitem.images)[0] : '/image/hd1.png'

                    return {
                        id : SQLitem.post_id,
                        text : SQLitem.title,
                        subText : SQLitem.content,
                        imageUrl ,
                    }
                })

                this.setData({
                    items : itemData,
                    SQLdata : data
                })
            })
        }

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