// pages/my/likes/likes.js
import { formatDateString, parseISODate } from '../../../utils/timeStamp'

// 通用的云容器调用函数
function callCloudContainer(path, userid) {
    return wx.cloud.callContainer({
        "config": {
            "env": "prod-9ggzinxb5b8ff0c5"
        },
        "path": path + userid,
        "header": {
            "X-WX-SERVICE": "express-41pr"
        },
        "method": "GET",
    }).catch(err => {
        console.error(`云容器调用出错: ${path}`, err);
        throw err;
    });
}

Page({
    data: {
        "items": [],
        SQLdata: [],
        options: {},
        groupedComments: []
    },
    itemtap: function (e) {
        const id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: `/pages/post/post?postid=` + id,
        });
    },
    onLoad: async function (options) {
        this.setData({ options });
        const { userid } = wx.getStorageSync('user_info')

        try {
            if (options.type === 'comments') {
				const res = await this.getCommentsByUserid(userid);
				const data = res.data.result;
				data.sort((a, b) => parseISODate(b.created_at) - parseISODate(a.created_at));
			
				const grouped = {};
				data.forEach(item => {
					const date = formatDateString(item.created_at).split(' ')[0]; // 只显示日期
					if (!grouped[date]) {
						grouped[date] = {
							date: date,
							comments: []
						};
					}
					grouped[date].comments.push({
						post_id: item.post_id,
						content: item.comment
					});
				});
			
				let groupedCommentsArray = Object.values(grouped);
				groupedCommentsArray.sort((a, b) => parseISODate(b.date) - parseISODate(a.date));
			
				this.setData({
					groupedComments: groupedCommentsArray
				});
			}
			else if (options.type === 'likes') {
                const res = await this.getLikesByUserid(userid);
                const data = res.data.result;
                data.sort((a, b) => parseISODate(b.created_at) - parseISODate(a.created_at))
                const itemData = data.map(SQLitem => {
                    return {
                        id: SQLitem.post_id,
                        text: '一条点赞',
                        subText: formatDateString(SQLitem.created_at),
                        imageUrl: '/image/hd1.png'
                    }
                })
                this.setData({
                    items: itemData,
                    SQLdata: data
                })
            } else if (options.type === 'posts') {
                const res = await this.getPostsByUserid(userid);
                const data = res.data;
                console.log(data.sort((a, b) => parseISODate(b.created_at) - parseISODate(a.created_at)))
                const itemData = data.map(SQLitem => {
                    const imageUrl = JSON.parse(SQLitem.images).length > 0 ? JSON.parse(SQLitem.images)[0] : '/image/hd1.png'
                    return {
                        id: SQLitem.post_id,
                        text: SQLitem.title,
                        subText: SQLitem.content,
                        imageUrl
                    }
                })
                this.setData({
                    items: itemData,
                    SQLdata: data
                })
            }
        } catch (error) {
            console.error('页面加载出错:', error);
        }
    },
    getPostsByUserid(userid) {
        return callCloudContainer('/post/userid?userid=', userid);
    },
    getLikesByUserid(userid) {
        return callCloudContainer('/post/like/userid?userid=', userid);
    },
    getCommentsByUserid(userid) {
        return callCloudContainer('/post/comment/userid?userid=', userid);
    }
})
