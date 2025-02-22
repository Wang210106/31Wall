const pageDic = {
    0 : "system",
    1 : "notice",
    2 : "likeComment",
}

Page({
	data: {
        hasEnteredLikeComment: false, // 新增，用于标记是否进入过点赞&评论页面
        items: [
                { id : 0, text : "系统通知", iconfont : "icon-xitongxiaoxi", badge : 0},
                { id : 1, text : "公告", iconfont : "icon-gonggao", badge : 100},
                { id : 2, text : "我收到的点赞＆评论", iconfont : "icon-pinglun", badge : 1},
        ],
	},
    itemtap: function(e) {
        const typeIndex = e.detail.type;

        const updatedItems = this.data.items;
        const updatedItem = updatedItems[typeIndex]; 
        updatedItem["badge"] = 0; 
        updatedItems[typeIndex] = updatedItem;

        this.setData({
            items: updatedItems,
            hasEnteredLikeComment: true,
        });

        const type = pageDic[typeIndex];
        
        wx.navigateTo({
            url: `/pages/msg/likeComment/likeComment?type=${type}`
        });
    },
  });