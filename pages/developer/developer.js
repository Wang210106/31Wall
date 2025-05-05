// pages/developer/developer.js
Page({
    data: {
        items: [
            { id : 0, text : '举报处理', iconfont: 'icon-jubao' },
            { id : 1, text : '查看已封禁帖子', iconfont: 'icon-fengjin' },
            { id : 2, text : '查看已封禁用户', iconfont: 'icon-fengjin' },
            { id : 3, text : '发布公告', iconfont: 'icon-gonggao' },
            { id : 4, text : '推送消息', iconfont: 'icon-xitongxiaoxi' },
        ]
    },

    onLoad(options) {
        if (wx.getStorageSync('user_info').status >= 0){
            wx.navigateBack({
                delta: -1,
            })
        }
    },
})