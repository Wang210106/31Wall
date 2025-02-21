Page({
    data: {
        title: '',
        content: '',
        mediaList: [],
        isAnonymous: false,
        partitionList: [
			{ name: '帖子预览', url: '/pages/post/post' },
            { name: '表白墙', url: '/pages/index/confession/confession' },
            { name: '学习互助', url: '/pages/index/study/study' },
            { name: '扩列专区', url: '/pages/index/kuolie/kuolie' },
            { name: '失物招领', url: '/pages/index/lost/lost' },
            //{ name: '帖子预览', url: '/pages/post/post' }
        ],
        partitionIndex: 0,
        partitionNames: [] // 新增属性
    },
    onLoad() {
        // 初始化 partitionNames
        this.setData({
            partitionNames: this.data.partitionList.map(item => item.name)
        });
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

    // 选择图片或视频
    chooseMedia() {
        wx.showActionSheet({
            itemList: ['选择图片', '选择视频'],
            success: (res) => {
                if (res.tapIndex === 0) {
                    this.chooseImage();
                } else if (res.tapIndex === 1) {
                    this.chooseVideo();
                }
            },
            fail: (err) => {
                console.log(err);
            }
        });
    },

    // 选择图片
    chooseImage() {
        wx.chooseImage({
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: (res) => {
                const tempFilePaths = res.tempFilePaths;
                const newMediaList = tempFilePaths.map(path => ({ type: 'image', path }));
                this.setData({
                    mediaList: this.data.mediaList.concat(newMediaList)
                }, () => {
                    this.updateMediaCount();
                });
            }
        });
    },

    // 选择视频
    chooseVideo() {
        wx.chooseVideo({
            sourceType: ['album', 'camera'],
            maxDuration: 60,
            camera: 'back',
            success: (res) => {
                const tempFilePath = res.tempFilePath;
                this.setData({
                    mediaList: this.data.mediaList.concat([{ type: 'video', path: tempFilePath }])
                }, () => {
                    this.updateMediaCount();
                });
            }
        });
    },

    // 删除媒体文件
    deleteMedia(e) {
        const index = e.currentTarget.dataset.index;
        const newMediaList = this.data.mediaList.filter((_, i) => i!== index);
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
        if (item.type === 'image') {
            const urls = this.data.mediaList.filter(item => item.type === 'image').map(item => item.path);
            wx.previewImage({
                current: item.path,
                urls
            });
        } else {
            wx.navigateTo({
                url: `pages/videoPlayer/videoPlayer?src=${item.path}`
            });
        }
    },

    // 匿名/实名选择事件处理
    onAnonymousChange(e) {
        this.setData({
            isAnonymous: e.detail.value === '1'
        });
    },

    // 帖子分区选择事件处理
    onPartitionChange(e) {
        this.setData({
            partitionIndex: e.detail.value
        });
    },

    // 发送帖子
    sendPost() {
        const { title, content, mediaList } = this.data;

        // 检测
        if (!content.trim() && mediaList.length === 0) {
            wx.showToast({
                title: '空白页面不能发送的哦~',
                icon: 'none'
            });
            return;
        }

        const { isAnonymous, partitionList, partitionIndex } = this.data;
        const partition = partitionList[partitionIndex];

        const postData = {
            title,
            content,
            images: mediaList.filter(item => item.type === 'image').map(item => item.path),
            videos: mediaList.filter(item => item.type === 'video').map(item => item.path),
            isAnonymous,
            postTime: new Date().getTime()
        };

        console.log('即将发送的帖子信息：', postData);

        if (partition.name === '其他分区') {
            // 使用 encodeURIComponent 处理数据，避免特殊字符问题
            const queryString = Object.keys(postData).map(key => {
                if (Array.isArray(postData[key])) {
                    return `${key}=${encodeURIComponent(postData[key].join(','))}`;
                }
                return `${key}=${encodeURIComponent(postData[key])}`;
            }).join('&');

            wx.navigateTo({
                url: `${partition.url}?${queryString}`
            });
        } else {
            wx.showToast({
                title: '发送成功',
                icon:'success'
            });
            if (partition.url) {
                wx.navigateTo({
                    url: partition.url
                });
            }
        }

        // 清空数据
        this.setData({
            title: '',
            content: '',
            mediaList: [],
            isAnonymous: false,
            partitionIndex: 0
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