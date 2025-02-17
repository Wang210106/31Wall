Page({
    data: {
        title: '',
        content: '',
        images: [],
        postTime: '',
        showComment: false,
        commentContent: '',
        comments: [],
        isAnonymous: false
    },

    // 格式化时间
    formatTime(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hour = date.getHours();
        const minute = date.getMinutes();
        return `${year}-${month}-${day} ${hour}:${minute}`;
    },

    onLoad(options) {
        console.log('接收到的参数:', options);
        const { title, content, images, isAnonymous, postTime } = options;

        this.setData({
            title: decodeURIComponent(title),
            content: decodeURIComponent(content),
            images: decodeURIComponent(images).split(','),
            isAnonymous: isAnonymous === 'true',
            postTime: this.formatTime(new Date(parseInt(decodeURIComponent(postTime))))
        }, () => {
            console.log('数据更新后:', this.data);
        });
    },

    // 返回上一页
    goBack() {
        wx.navigateBack({
            delta: 1
        });
    },

    // 点赞功能
    likePost() {
        // 点赞逻辑
        console.log('点赞成功');
    },

    // 匿名点赞功能
    likePostAnonymously() {
        // 匿名点赞逻辑
        console.log('匿名点赞成功');
    },

    // 显示评论输入框
    showCommentInput() {
        this.setData({
            showComment: true
        });
    },

    // 输入评论内容
    onCommentInput(e) {
        this.setData({
            commentContent: e.detail.value
        });
    },

    // 切换实名/匿名
    toggleAnonymous(e) {
        const value = e.detail.value === 'true';
        this.setData({
            isAnonymous: value
        });
    },

    // 提交评论
    submitComment() {
        const comment = {
            username: '用户名',
            time: this.formatTime(new Date()),
            content: this.data.commentContent,
            isAnonymous: this.data.isAnonymous
        };
        const comments = this.data.comments;
        comments.push(comment);
        this.setData({
            comments: comments,
            showComment: false,
            commentContent: '',
            isAnonymous: false
        });
        console.log('评论提交成功');
    },

    // 取消评论
    cancelComment() {
        this.setData({
            showComment: false,
            commentContent: '',
            isAnonymous: false
        });
    },

    // 转发帖子
    forwardPost() {
        // 转发逻辑
        console.log('转发成功');
    },

    // 举报帖子
    reportPost() {
        // 举报逻辑
        console.log('举报成功');
    },

    // 预览图片
    previewImage(e) {
        const current = e.currentTarget.dataset.images[e.currentTarget.dataset.index];
        const urls = e.currentTarget.dataset.images;
        wx.previewImage({
            current: current,
            urls: urls
        });
    }
});