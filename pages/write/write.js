import { isEmptyValue } from '../../utils/objectOperate'

Page({
    data: {
        title: '',
        content: '',
        mediaList: [],
        isRealname: 0, //1实名 0匿名
    },

    // 标题输入事件处理
    onTitleInput(e) {
        this.setData({
            title: e.detail.value
        });
    },

    // 内容输入事件处理
    onContentInput(e) {
        this.setData({
            content: e.detail.value
        });
    },

    // 选择图片
    chooseMedia() {
        wx.chooseMedia({
            mediaType: ['image'],
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: (res) => {
                const tempFilePath = res.tempFiles;
                const newMediaList = tempFilePath.map(path => ({ type: 'image', path }));

                this.setData({
                    mediaList: [ ...this.data.mediaList ,newMediaList[0].path.tempFilePath ]
                },() => {
                    console.log(this.data.mediaList)
                });
            }
        });
    },

    // 删除媒体文件
    deleteMedia(e) {
        const index = e.currentTarget.dataset.index;
        const newMediaList = this.data.mediaList.filter((_, i) => i !== index);
        this.setData({
            mediaList: newMediaList
        }, () => {
            this.updateMediaCount();
        });
    },

    // 预览媒体文件
    previewMedia(e) {
        const index = e.currentTarget.dataset.index;
        const item = this.data.mediaList[index];

        if(!item) return

        const urls = this.data.mediaList.map(item => item.path);
        wx.previewImage({
            current: item.path,
            urls
        });

    },

    // 匿名/实名选择事件处理
    onRealnameChange(e) {
        this.setData({
            isRealname: e.detail.value == 0
        });
    },

    // 发送帖子
    sendPost() {
        const { title, content, mediaList } = this.data;

        const { isRealname } = this.data;

        const postData = {
            title,
            content,
            userid: wx.getStorageSync('user_info').userid,
            images: mediaList,
            realname: isRealname,
        };

        //检测
        for (const key in postData) {
            if (Object.prototype.hasOwnProperty.call(postData, key) && isEmptyValue(postData[key])) {
                if (key === 'images') continue

                wx.showToast({
                  title: '标题和内容不能是空值捏',
                  icon: 'none'
                })
                return;
            }
        }

        console.log('即将发送的帖子信息：', postData);

        // 清空数据
        this.setData({
            title: '',
            content: '',
            mediaList: [],
            isRealname: 0,
        });
    },

    // 更新媒体数量
    updateMediaCount() {
        const query = wx.createSelectorQuery();
        query.select('.upload-area').fields({ dataset: true }, (res) => {
            if (res) {
                res.dataset.mediaCount = this.data.mediaList.length;
                this.setData({
                    'uploadAreaDataset': res.dataset
                });
            }
        }).exec();
    }
});