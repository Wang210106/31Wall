const pageDic = {
    0 : "system",
    1 : "notice",
    2 : "likeComment",
}

Page({
	data: {
        items: [
                { id : 0, text : "系统通知", iconfont : "icon-xitongxiaoxi"},
                { id : 1, text : "公告", iconfont : "icon-gonggao"},
                { id : 2, text : "我收到的点赞＆评论", iconfont : "icon-pinglun"},
        ],
	},
    itemtap: function(e) {
        const typeIndex = e.detail.type;
        const type = pageDic[typeIndex];
        //wx.setStorageSync(type + '_time', )

        const updatedItems = this.data.items;
        const updatedItem = updatedItems[typeIndex]; 
        updatedItem["badge"] = 0; 
        updatedItems[typeIndex] = updatedItem;

        this.setData({
            items: updatedItems,
        });

        //系统消息
        if(type === 'system' || type === 'notice'){
            wx.navigateTo({
                url: `/pages/msg/likes/likes?type=` + type
            });
            
            return
        }
        
        wx.navigateTo({
            url: `/pages/msg/likeComment/likeComment?type=${type}`
        });
    },
  });