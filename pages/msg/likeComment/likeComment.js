// pages/msg/likeComment/likeComment.js
import { formatTimestamp0 } from "../../../utils/timeStamp"

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

	onShareAppMessage() {
        return {
            title: '我收到的点赞&评论',
            path: '/pages/msg/likeComment/likeComment'
        };
    },
    
    onLoad: function (option) {
        const type = option.type
        console.log(type)

        const formattedMessages = this.data.messages.map((message) => {
          return {
            ...message,
            time: formatTimestamp0(message.time)
          };
        });
        this.setData({
            messages: formattedMessages
        });
    },
});