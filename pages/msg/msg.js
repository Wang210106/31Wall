import { convertUtcToUtcPlus8 } from '../../utils/timeStamp'
import { getNoticeByUserid, getPostsByUserid, getCommentsByPostid, getLikesByPostid } from '../../utils/netRequest'
 
const pageDic = {
    0 : "system",
    1 : "notice",
    2 : "likeComment",
}

const NoticeID = 2;//使用该id发送帖子将被识别为公告

Page({
	data: {
        items: [
                { id : 0, text : "系统通知", iconfont : "icon-xitongxiaoxi"},
                { id : 1, text : "公告", iconfont : "icon-gonggao"},
                { id : 2, text : "我收到的点赞＆评论", iconfont : "icon-pinglun"},
        ],
    },

    async onShow(){
        await this.update()
    },

    onPullDownRefresh: async function () {
        wx.showNavigationBarLoading();
    
        await this.update()
    
        setTimeout(() => {
          wx.stopPullDownRefresh();
          wx.hideNavigationBarLoading();
        }, 1000);
    },

    async update(){
        const systemRes = (await getNoticeByUserid(wx.getStorageSync('user_info').userid)).data
        const noticeRes = (await getPostsByUserid(NoticeID)).data

        const userInfo = wx.getStorageSync('user_info');
        const posts = await getPostsByUserid(userInfo.userid);
        const postsID = posts.data.map(post => post.post_id);
 
        const likesPromises = postsID.map(postId => 
            getLikesByPostid(postId).then(response => response.data.result)
        );

        const commentsPromises = postsID.map(
            postId => getCommentsByPostid(
                postId,wx.getStorageSync('user_info').userid
                )
                .then(response => response.data.result)
        );
 
        const likesData = await Promise.all(likesPromises);
        const commentsData = await Promise.all(commentsPromises);
        
        const LaCList = [ ...likesData, ...commentsData ].flat()
        
        wx.setStorageSync('_lac', [systemRes,noticeRes,LaCList])

        const items = this.data.items;

        items[0].badge = this.countLaterThanTimestamp(systemRes,wx.getStorageSync('system_time'))
        items[1].badge = this.countLaterThanTimestamp(noticeRes,wx.getStorageSync('notice_time'))
        items[2].badge = this.countLaterThanTimestamp(LaCList,wx.getStorageSync('likeComment_time'))

        this.setData({
            items,
        })
    },

    itemtap: function(e) {
        const typeIndex = e.detail.type;
        const type = pageDic[typeIndex];
        wx.setStorageSync(type + '_time', JSON.stringify(Date.now()))

        const updatedItems = this.data.items;
        const updatedItem = updatedItems[typeIndex]; 
        updatedItem["badge"] = 0; 
        updatedItems[typeIndex] = updatedItem;

        this.setData({
            items: updatedItems,
        });

        wx.setStorageSync(type + '_time', JSON.stringify(Date.now()))
        //系统消息
        if(type === 'system' || type === 'notice'){
            wx.navigateTo({
                url: `/pages/msg/likes/likes?type=` + type
            });
        }
        else if (type === 'likeComment'){
            wx.navigateTo({
                url: `/pages/msg/likeComment/likeComment?type=${type}`
            });
        }
        
    },

    countLaterThanTimestamp(systemRes, timestamp) {
        const compareDate = new Date(+timestamp);// 假设 timestamp 是秒级时间戳，需要乘以 1000 转换为毫秒
        let count = 0;
     
        for (const item of systemRes) {
            const utcDate = new Date(convertUtcToUtcPlus8(item.created_at));
            // 比较日期（基于 UTC 时间）
            if (utcDate > compareDate) {

                count++;
            }
        }
     
        return count;
    },
});