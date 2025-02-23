// pages/my/my.js
const pageDic = {
    0 : { name : "posts", type : "likes"},
    1 : { name : "likes", type : "likes"},
    2 : { name : "comments", type : "likes"},
    4 : { name : "setting", type : "setting"},
    5 : { name : "developer", type : "developer"},
    6 : { name : "support", type : "support"},
    7 : { name : "connect", type : "likes"},
}

const maxColor = 3;

Page({
    data: {
        items0: [
            { id : 0, text : "我的发帖", iconfont : "icon-wofadetiezi"},
            { id : 1, text : "我的点赞", iconfont : "icon-24px"},
            { id : 2, text : "我的评论", iconfont : "icon-pinglun"},
        ],
        items1: [
            { id : 4, text : "设置", iconfont : "icon-shezhi"},
            { id : 5, text : "开发者名单", iconfont : "icon-kaifazheguanli"},
            { id : 6, text : "支持一下", iconfont : "icon-juankuanmingxi"},
            { id : 7, text : "问题反馈＆联系我们", iconfont : "icon-jishuzhichi"},
        ],
        userInfo: {
            avatar_url: "/image/hd1.png",
            nickname: "车柏乐",
            class: 10,
            grade: 26,
        },
        backColor: 0,
    },
    
    onLoad() {
        this.setData({
            userInfo: wx.getStorageSync('user_info')
        })
    },

    handleTap: e => {
        const typeIndex = e.detail.type;
        const type = pageDic[typeIndex];

        wx.navigateTo({
            url: `/pages/my/${type.type}/${type.type}?type=${type.name}`
        });
    },

    handleColor: function() {
        this.setData({
            backColor: this.data.backColor < maxColor ? this.data.backColor + 1 : 0,
        })
    },
})