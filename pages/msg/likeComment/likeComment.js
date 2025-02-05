// pages/msg/likeComment/likeComment.js
Page({
	data: {
	  messages: [
		{
		  id: 1,
		  avatar: '/image/hd1.png',
		  name: '用户1',
		  time: '2025-02-03 10:00',
		  content: '这是一条点赞评论消息示例'
		},
		{
		  id: 2,
		  avatar: '/image/hd1.png',
		  name: '用户2',
		  time: '2025-02-03 11:30',
		  content: '另一条点赞评论消息示例'
		}
	  ]
	},
	addMessageFromConsole: function (input) {
	  const parts = input.split(':');
	  if (parts.length!== 3) {
		console.error('输入格式错误，应使用"用户名:消息内容:指定id"的格式');
		return;
	  }
	  const newId = parseInt(parts[2]);
	  const existingMessage = this.data.messages.find(message => message.id === newId);

	  const newMessage = {
		id: newId,
		avatar: '/image/hd1.png',
		name: parts[0].trim(),
		time: this.formatTime(new Date()),
		content: parts[1].trim() // 确保设置了消息内容
	  };
	  const currentMessages = this.data.messages;
	  currentMessages.push(newMessage);
	  this.setData({
		messages: currentMessages
	  });
	},
	formatTime: function (date) {
	  const year = date.getFullYear();
	  const month = date.getMonth() + 1;
	  const day = date.getDate();
	  const hour = date.getHours();
	  const minute = date.getMinutes();
	  const second = date.getSeconds();
	  return [year, month, day].map(this.formatNumber).join('-') + ' ' + [hour, minute, second].map(this.formatNumber).join(':');
	},
	formatNumber: function (n) {
	  n = n.toString();
	  return n[1]? n : '0' + n;
	},
	onLoad() {
	  const app = getApp();
	  app.likeCommentAddMessage = this.addMessageFromConsole.bind(this);
	},
	handleMessageTap: function (e) {
	  const index = e.currentTarget.dataset.index;
	  if (index!== undefined && index < this.data.messages.length) {
		const message = this.data.messages[index];
		console.log('点击了消息项', message);
		wx.navigateTo({
		  url: `/pages/msg/likeCommentDetail/likeCommentDetail?id=${message.id}`
		});
	  } else {
		console.error('无效的消息索引', index);
	  }
	}
  });