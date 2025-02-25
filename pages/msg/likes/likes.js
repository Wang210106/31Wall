// pages/my/likes/likes.js
const ManagerID = 1;//使用该id发送帖子将被识别为系统通知
const NoticeID = 2;//使用该id发送帖子将被识别为公告

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
        let userid;

        if (options.type == 'system'){
            userid = ManagerID
        }
        else if (options.type == 'notice'){
            userid = NoticeID
        }

        await this.getPostsByUserid(userid)
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
})