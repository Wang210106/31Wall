Page({
    data: {
        programmers: [
            'Wang210106',
            '姜博然',
            '花生酱'
        ],
        planners: [
			'梁越',
			'谢佳桐',
            '神经病',
            '大糖宝',
            '张子萱'
        ],
        isRainbowEffect: false,
        allNames: [],
        clickedNames: []
    },
    onLoad() {
        // 页面加载时，合并所有人员名字到 allNames 数组
        this.setData({
            allNames: [...this.data.programmers, ...this.data.planners]
        });
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
                if (this.isClickedInOrder()) {
                    this.setData({
                        isRainbowEffect: true
                    });
				}
				//彩蛋逻辑：按照从上往下的顺序点遍每个名字，再点击花生酱即可
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
            case '谢佳桐':
                message = '你好 我是31彭于晏 有点小帅小幽默 •͈ ₃ •͈ ';
                break;
        }
        wx.showToast({
            title: message,
            icon: 'none',
            duration: 2000
        });
		// 将点击的名字添加到 clickedNames 数组中
		//彩蛋逻辑：按照从上往下的顺序点遍每个名字，再点击花生酱即可
        if (!this.data.clickedNames.includes(name)) {
            this.data.clickedNames.push(name);
        }
    },
    isClickedInOrder() {
        const allNames = this.data.allNames;
        const clickedNames = this.data.clickedNames;
        // 检查 clickedNames 是否包含 allNames 的所有元素，并且顺序一致
        if (clickedNames.length < allNames.length) {
            return false;
        }
        for (let i = 0; i < allNames.length; i++) {
            if (allNames[i] !== clickedNames[i]) {
                return false;
            }
        }
        return true;
    }
});