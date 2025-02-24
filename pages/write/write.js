import { generateUniqueFileName } from '../../utils/randomName'

Page({
    data: {
        isUpdating: false,

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
                const imageIndex = this.data.mediaList.length

                this.setData({
                    mediaList: [ ...this.data.mediaList ,'/image/hd1.png' ],
                    isUpdating: true
                });

                const extension = tempFilePath[0].tempFilePath.split('.')[tempFilePath[0].tempFilePath.split('.').length - 1]

                wx.cloud.uploadFile({
                    cloudPath: 'postImage/' + generateUniqueFileName(extension),
                    filePath: tempFilePath[0].tempFilePath,
                    config: {
                        env: 'prod-9ggzinxb5b8ff0c5'
                    }
                }).then(res => {
                    this.setData({
                        isUpdating: false,
                    })

                    const dataArray = this.data.mediaList
                    dataArray[imageIndex] = res.fileID

                    this.setData({
                        mediaList: dataArray
                    })
                }).catch(err => {
                    console.log(err);

                    this.deleteMedia({
                        currentTarget: {
                            dataset: {
                                index: imageIndex
                            }
                        }
                    })//模拟e
                })
            }
        });
    },

    // 删除媒体文件
    deleteMedia(e) {
        const index = e.currentTarget.dataset.index;
        const newMediaList = this.data.mediaList.filter((_, i) => i !== index);

        this.setData({
            isUpdating: true
        })
    
        wx.cloud.deleteFile({
            fileList: [ this.data.mediaList[index] ]
        }).then(res => {
            this.setData({
                isUpdating: false
            })
        })

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
            isRealname: e.detail.value
        });
    },

    // 发送帖子
    sendPost() {
        const { title, content, mediaList, isRealname } = this.data;

        console.log(isRealname)

        const postData = {
            title,
            content,
            userid: wx.getStorageSync('user_info').userid,
            images: mediaList,
            realname: isRealname,
        };

        //验证
        if (this.data.content === '' && this.data.mediaList.length === 0){
            wx.showToast({
                title: '图片和内容不能都是空值捏',
                icon: 'none'
            })

            return
        }
        

        if(this.data.isUpdating){
            wx.showToast({
                title: '有图片未完成上传',
                icon: 'none'
              })
              return;
        }

        //upload
        wx.cloud.callContainer({
            "config": {
                "env": "prod-9ggzinxb5b8ff0c5"
            },
            "path": "/post",
            "header": {
            "X-WX-SERVICE": "express-41pr"
            },
            "method": "POST",
            "data": postData,
        }).then(res => {
            wx.showToast({
                title: '上传成功',
                icon: 'success'
            })
            
            console.log(res)
        })

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