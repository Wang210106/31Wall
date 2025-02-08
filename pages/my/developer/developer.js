Page({
	data: {
	  programmers: [
		'Wang210106',
		'姜博然',
		'花生酱'
	  ],
	  planners: [
		'梁越',
		'神经病',
		'大糖宝',
		'张子萱',
		'name',
	  ],
	  isRainbowEffect: false
	},
	onItemTap(e) {
	  const name = e.currentTarget.dataset.name;
	  let message = '';
	  switch (name) {
		case '梁越':
		  message = '我是人机';
		  break;
		case '花生酱':
		  message = '你拍了拍花生酱，哇~真的是你啊';
		  break;
		case 'Wang210106':
		  message = 'text3';
		  break;
		case '神经病':
		  message = '幕后团队来啦，喜欢就支持一下吧';
		  break;
		case '姜博然':
		  message = 'text4';
		  break;
		case '大糖宝':
	      message = '不要再骂我了，好不好嘛～';
		  break;
		case '张子萱':
		  message = '哎呦，不错呦';
		  break;
		default:
		  message = `你点击了 ${name}`;
	  }
	  wx.showToast({
		title: message,
		icon: 'none',
		duration: 2000
	  });
	  if (name === '花生酱') {
		this.setData({
		  isRainbowEffect: true
		});
	  }
	}
  })