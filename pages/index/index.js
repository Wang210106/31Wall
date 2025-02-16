// index.js
Page({
    data: {
        posts: [], // 存储帖子数据
        kingkongList: [
			{ icon: '/image/hd1.png', text: '帖子预览', url: '/pages/post/post' },  
            { icon: '/image/btnbar/gr1.png', text: '表白墙', url: '/pages/index/confession/confession' },
            { icon: '/image/btnbar/gr1.png', text: '学习互助', url: '/pages/index/study/study' },
            { icon: '/image/btnbar/gr1.png', text: '扩列专区', url: '/pages/index/kuolie/kuolie' },
            { icon: '/image/btnbar/gr1.png', text: '失物招领', url: '/pages/index/lost/lost' },
			{ icon: '/image/btnbar/gr1.png', text: '其他分区', url: '' },  //空
			{ icon: '/image/btnbar/gr1.png', text: '其他分区', url: '' },  //空
			{ icon: '/image/btnbar/gr1.png', text: '其他分区', url: '' },  //空
        ]
    },

	//AI写的，估计没啥用
    onLoad: function () {
        // 向后端请求帖子数据
        wx.request({
            url: '/post/all', // 后端接口地址
            method: 'GET',
            success: (res) => {
                if (res.data.length > 0) {
                    // 将获取到的帖子数据更新到页面数据中
                    this.setData({
                        posts: res.data
                    });
                }
            },
            fail: (err) => {
                console.error('获取帖子数据失败', err);
            }
        });
    },


    // 处理点击事件，进行页面跳转
    navigateToPage(e) {
        // 从事件对象中获取跳转路径
        const url = e.currentTarget.dataset.url;
        console.log('点击获取到的url:', url);
        if (url) {
            // 使用 wx.navigateTo 进行页面跳转
            wx.navigateTo({
				url: url,
				//跳转URL不会写，红温了，但能用
                success: () => {
                    console.log('页面跳转成功');
                },
                fail: (err) => {
                    console.error('页面跳转失败:', err);
                }
            });
        }
    }
});