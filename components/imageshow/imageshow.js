Component({
    /**
     * 组件的属性列表
     */
    properties: {
        // 图片列表
        imgList: {
            type: Array,
            value: []
        }
    },
    /**
     * 组件的初始数据
     */
    data: {
        // 样式模式
        mode: ''
    },
    /**
     * 组件的方法列表
     */
    methods: {
        handleImageError(e) {
            const index = e.currentTarget.dataset.index;
           
            let imgList = this.data.imgList;
            imgList[index] = '/image/hd1.png';
            this.setData({
                imgList
            });
        },
        handleImageClick(e) {
            const index = e.currentTarget.dataset.index;
            const current = this.data.imgList[index];
            wx.previewImage({
                current,
                urls: this.data.imgList
            });
        }
    },
    attached() {
        const imgCount = this.data.imgList.length;
        let mode = '';
        if (imgCount > 9) {
            mode = 'large-image-mode';
        }
        this.setData({
            mode
		});
		console.log('组件接收到的imgList数据:', this.properties.imgList);
    }
});