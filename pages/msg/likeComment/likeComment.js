// pages/msg/likeComment/likeComment.js
import { formatTimestamp0 } from "../../../utils/timeStamp"

const ManagerID = 1//这个id发的帖子将被识别为系统通知

Page({
	data: {
	  messages: [
		{
            id: 1,
            avatar: '/image/hd1.png',
            name: '用户1',
            time: 1738847518772,
            content: '这是一条点赞评论消息示例'
		},
		{
            id: 2,
            avatar: '/image/hd1.png',
            name: '用户2',
            time: 1738847118772,
            content: '另一条点赞评论消息示例'
        },
        {
            id: 3,
            avatar: '/image/hd1.png',
            name: '用户3',
            time: 1738827118772,
            content: '另一条点赞评论消息示例'
		}
	  ]
	},
    
    onLoad: function (option) {
        if(option.type === "system"){
            this.getPostsByUserid(ManagerID)
            .then(res => res.data)
            .then(data => {
                console.log(data)
                const dataArray = data.map(obj => ({
                    id: obj.post_id,
                    avatar: JSON.parse(obj.images)[0],
                    name: obj.title,
                    time: obj.created_at,
                    content: obj.content,
                }))

                this.setData({
                    messages: dataArray
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
});