const pageDic = {
    0 : "system",
    1 : "notice",
    2 : "likeComment",
}

Page({
	data: {
        badges: [0, 100, 1],
        hasEnteredLikeComment: false, // 新增，用于标记是否进入过点赞&评论页面
        items: [
                { id : 0, text : "系统通知", iconfont : "icon-xitongxiaoxi"},
                { id : 1, text : "公告", iconfont : "icon-gonggao"},
                { id : 2, text : "我收到的点赞＆评论", iconfont : "icon-shoudaodepinglun"},
        ],
	},
	navigateToMessages: function (event) {
        const typeIndex = event.detail.type;
        const type = pageDic[typeIndex];

        wx.navigateTo({
            url: `/pages/msg/${type}/${type}`
        });

        const updatedBadges = this.data.badges; 
        updatedBadges[typeIndex] = 0; 

        this.setData({
            badges: updatedBadges,
            hasEnteredLikeComment: true,
        });
	},
  });