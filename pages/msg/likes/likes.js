// pages/my/likes/likes.js
const NoticeID = 2;//使用该id发送帖子将被识别为公告

Page({
    data: {
        "items" : [],
        SQLdata: [],
        type: '',
    },
    itemtap: e => {
        const id = e.detail.type;

        //系统公告
        if(id[0] == 'n'){
            return
        }

        wx.navigateTo({
            url: `/pages/post/post?postid=` + id,
        });
    },
    onLoad: async function(options) {   
        this.setData({
            type: options.type
        })

        await this.update()
    },

    onPullDownRefresh: async function () {
        wx.showNavigationBarLoading();
    
        const { type } = this.data

        if (type == 'system'){
            const res = await this.getNoticeByUserid(wx.getStorageSync('user_info').userid)
            
            if (res.statusCode !== 200){
                console.log(res.message)
                return 
            }

            const itemData = res.data.map(SQLitem => ({
                id : 'notification' + SQLitem.noid,
                text : SQLitem.title.slice(0,15) || '校园帖子' ,
                subText : SQLitem.content.slice(0,15),
                imageUrl : JSON.parse(SQLitem.images)[0],
            }))

            this.setData({
                items : itemData,
                SQLdata : res.data
            })
        }
        else if (type == 'notice'){
            await this.getPostsByUserid(NoticeID)
            .then(res => res.data)
            .then(data => {
                const itemData = data.map(SQLitem => ({
                    id : SQLitem.post_id,
                    text : SQLitem.title.slice(0,15) || '校园帖子' ,
                    subText : SQLitem.content.slice(0,15),
                    imageUrl : JSON.parse(SQLitem.images)[0],
                }))

                this.setData({
                    items : itemData,
                    SQLdata : data
                })
            })
        }
    
        setTimeout(() => {
          wx.stopPullDownRefresh();
          wx.hideNavigationBarLoading();
        }, 1000);
    },

    update: async function (){
        const { type } = this.data

        if (type == 'system'){
            const res = wx.getStorageSync('_lac')[0]

            const itemData = res.map(SQLitem => ({
                id : 'notification' + SQLitem.noid,
                text : SQLitem.title.slice(0,15) || '校园帖子' ,
                subText : SQLitem.content.slice(0,15),
                imageUrl : JSON.parse(SQLitem.images)[0],
            }))

            this.setData({
                items : itemData,
                SQLdata : res
            })
        }
        else if (type == 'notice'){
            const res = wx.getStorageSync('_lac')[1]

            const itemData = res.map(SQLitem => ({
                id : SQLitem.post_id,
                text : SQLitem.title.slice(0,15) || '校园帖子' ,
                subText : SQLitem.content.slice(0,15),
                imageUrl : JSON.parse(SQLitem.images)[0],
            }))

            this.setData({
                items : itemData,
                SQLdata : res
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

    getNoticeByUserid(userid){
        return wx.cloud.callContainer({
            "config": {
                "env": "prod-9ggzinxb5b8ff0c5"
            },
            "path": "/report/notice?userid=" + userid,
            "header": {
                "X-WX-SERVICE": "express-41pr"
            },
            "method": "GET",
        })
    },
})