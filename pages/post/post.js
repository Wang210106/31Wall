import { formatDateString } from '../../utils/timeStamp'

Page({
    data: {
        title: '',
        content: '',
        images: [],
        postTime: '',
        commentContent: '',
        isAnonymous: false,
        comments: [],
        likes_count: 0,
        comments_count: 0,
        post_id: -1,
        userinfo: {
            nickname: '匿名捏',
            avatar_url: '/image/hd1.png'
        },
        selfPost: false,
        isLiked: false,
        showCommentInput: false
    },

    async onLoad(option) {
        const postInfo = option.postid ?
            (await this.getPostById(option.postid)).data.result[0] :
            JSON.parse(wx.getStorageSync('_post'));

        const { title, content, realname, user_id, post_id } = postInfo;
        let images = postInfo.images;

        if (typeof images === 'string') {
            images = JSON.parse(images);
        }

        if (realname) {
            let userinfo = (await this.getUserById(user_id)).data;
            this.setData({
                userinfo
            });
        }

        // 自己发的
        if (wx.getStorageSync('user_info').userid === user_id) {
            this.setData({
                selfPost: true
            });
        }

        this.setData({
            isLiked: wx.getStorageSync('self_like').indexOf(post_id) >= 0
        });

        const [likeResult, commentResult] = await Promise.all([
            this.getLikeAmount(post_id),
            this.getCommentsByPostid(post_id)
        ]);

        const likes_count = likeResult.data[0]['COUNT(*)'];
        const originComments = commentResult.data.result;

        const comments = await Promise.all(originComments.map(async value => {
            const { created_at, user_id } = value;
            const newTime = formatDateString(created_at);
            const userInfo = await this.getUserById(user_id);
            const { avatar_url, nickname } = userInfo.data;

            return { ...value, created_at: newTime, avatar_url, nickname };
        }));

        this.setData({
            title,
            content,
            images,
            postTime: postInfo.post_time || formatDateString(postInfo.created_at),
            post_id,
            likes_count,
            comments_count: comments.length,
            comments
        });
    },

    // 点赞功能
    async likePost() {
        const userid = wx.getStorageSync('user_info').userid;
        const postid = this.data.post_id;

        const like = {
            userid,
            postid
        };

        // 取消点赞
        if (this.data.isLiked) {
            this.setData({
                isLiked: false
            });

            const self_likes = wx.getStorageSync('self_like');
            self_likes.splice(self_likes.indexOf(postid), 1);
            wx.setStorageSync('self_like', self_likes);

            await this.deleteLike(postid, userid);

            const likeAmount = await this.getLikeAmount(postid);
            this.setData({
                likes_count: likeAmount.data[0]['COUNT(*)']
            });

            return;
        }

        this.setData({
            isLiked: true
        });

        wx.setStorageSync('self_like', [
            ...wx.getStorageSync('self_like'),
            postid
        ]);

        await this.postLike(like).then(async res => {
            if (res.data.error === 'User has already liked this post') {
                wx.showToast({
                    title: '已经点赞了哦'
                });
            }

            const likeAmount = await this.getLikeAmount(postid);
            this.setData({
                likes_count: likeAmount.data[0]['COUNT(*)']
            });
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
        // 获取评论内容并去除首尾空格
        const commentContent = this.data.commentContent.trim();
        if (commentContent === '') {
            // 若评论内容为空，给出提示
            wx.showToast({
                title: '评论内容不能为空',
                icon: 'none',
                duration: 2000
            });
            return;
        }

        const comment = {
            userid: wx.getStorageSync('user_info').userid,
            comment: commentContent,
            anonymous: this.data.isAnonymous ? 1 : 0,
            postid: this.data.post_id
        };

        // 清空输入框和匿名状态
        this.setData({
            commentContent: '',
            isAnonymous: false,
            showCommentInput: false
        });

        // 上传评论
        this.postComments(comment)
           .then(async (res) => {
                console.log('服务器响应:', res);

                const ocm = await this.getCommentsByPostid(this.data.post_id);
                const originComments = ocm.data.result;

                const comments = await Promise.all(originComments.map(async value => {
                    const { created_at, user_id } = value;
                    const newTime = formatDateString(created_at);
                    const userInfo = await this.getUserById(user_id);
                    const { avatar_url, nickname } = userInfo.data;

                    return { ...value, created_at: newTime, avatar_url, nickname };
                }));

                this.setData({
                    comments_count: comments.length,
                    comments
                });
            });
    },

    // 取消评论
    cancelComment() {
        this.setData({
            commentContent: '',
            isAnonymous: false,
            showCommentInput: false
        });
    },

    // 转发帖子
    forwardPost() {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
		});
		console.log('点击转发'); 
    },

    // 点击评论按钮显示输入框
    showCommentInput() {
        this.setData({
            showCommentInput: true
        });
    },

    // 举报帖子
    reportPost() {
        const { post_id } = this.data;
        const deletePostById = this.deletePostById;

        if (this.data.selfPost) {
            wx.showModal({
                title: '删除帖子',
                content: '您真的要删除这个帖子吗？',
                success(res) {
                    if (res.confirm) {
                        deletePostById(post_id)
                           .then(res => {
                                wx.showToast({
                                    title: '已删除'
                                });

                                wx.switchTab({
                                    url: '/pages/index/index'
                                });
                            });
                    }
                }
            });

            return;
        }

        // 举报
        console.log('举报成功');
    },

    // 预览图片
    previewImage(e) {
        const current = e.currentTarget.dataset.images[e.currentTarget.dataset.index];
        const urls = e.currentTarget.dataset.images;
        wx.previewImage({
            current,
            urls
        });
    },

    getLikeAmount(postid) {
        return wx.cloud.callContainer({
            config: {
                env: 'prod-9ggzinxb5b8ff0c5'
            },
            path: `/post/like/amount?postid=${postid}`,
            header: {
                'X-WX-SERVICE': 'express-41pr'
            },
            method: 'GET'
        });
    },

    getUserById(userid) {
        return wx.cloud.callContainer({
            config: {
                env: 'prod-9ggzinxb5b8ff0c5'
            },
            path: `/user/userid?userid=${userid}`,
            header: {
                'X-WX-SERVICE': 'express-41pr'
            },
            method: 'GET'
        });
    },

    getPostById(postid) {
        return wx.cloud.callContainer({
            config: {
                env: 'prod-9ggzinxb5b8ff0c5'
            },
            path: `/post?postid=${postid}`,
            header: {
                'X-WX-SERVICE': 'express-41pr'
            },
            method: 'GET'
        });
    },

    deletePostById(postid) {
        return wx.cloud.callContainer({
            config: {
                env: 'prod-9ggzinxb5b8ff0c5'
            },
            path: `/post?postid=${postid}`,
            header: {
                'X-WX-SERVICE': 'express-41pr'
            },
            method: 'DELETE'
        });
    },

    postComments(comment) {
        return wx.cloud.callContainer({
            config: {
                env: 'prod-9ggzinxb5b8ff0c5'
            },
            path: '/post/comment',
            header: {
                'X-WX-SERVICE': 'express-41pr'
            },
            method: 'POST',
            data: comment
        });
    },

    postLike(comment) {
        return wx.cloud.callContainer({
            config: {
                env: 'prod-9ggzinxb5b8ff0c5'
            },
            path: '/post/like',
            header: {
                'X-WX-SERVICE': 'express-41pr'
            },
            method: 'POST',
            data: comment
        });
    },

    getCommentsByPostid(postid) {
        return wx.cloud.callContainer({
            config: {
                env: 'prod-9ggzinxb5b8ff0c5'
            },
            path: `/post/comment/postid?postid=${postid}`,
            header: {
                'X-WX-SERVICE': 'express-41pr'
            },
            method: 'GET'
        });
    },

    deleteLike(postid, userid) {
        return wx.cloud.callContainer({
            config: {
                env: 'prod-9ggzinxb5b8ff0c5'
            },
            path: `/post/like?postid=${postid}&userid=${userid}`,
            header: {
                'X-WX-SERVICE': 'express-41pr'
            },
            method: 'DELETE'
        });
    },

    // 分享到朋友圈
    onShareTimeline() {
        return {
            title: this.data.title,
            query: {
                postid: this.data.post_id
            }
        };
    },

    // 分享给好友
    onShareAppMessage() {
        return {
            title: this.data.title,
            path: `/pages/postDetail/postDetail?postid=${this.data.post_id}`
        };
    }
});