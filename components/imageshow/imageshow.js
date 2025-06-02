Component({
    properties: {
        // 图片列表，类型为数组，默认值为空数组
        imgList: {
            type: Array,
            value: [],
            // observer: function(newVal, oldVal) {
            //     console.log('imgList 改变了:', newVal);
            // }
        }
    },
 
    data: {

    },
 
    methods: {
        handleImageError(e) {
            const index = e.currentTarget.dataset.index;
            let imgList = this.properties.imgList; 
            imgList[index] = '/image/hd1.png';
        },
 
        handleImageClick(e) {
            const index = e.currentTarget.dataset.index;
            const current = this.properties.imgList[index]; 

            wx.previewImage({
                urls: [current]   
            });
        }
    },
});