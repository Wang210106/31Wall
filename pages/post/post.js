import { formatDateString } from '../../utils/timeStamp'
import {    
            getLikeAmount,
            getUserInfo,
            getPostById,
            deletePostById,
            postComments,
            postLike,
            postReply,
            postCommentLike,
            deleteLike,
            deleteComments,
            getCommentsByPostid
        } 
from '../../utils/netRequest.js'

Page({
    data: {
        currentUserId : wx.getStorageSync('user_info').userid,

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

        commentType: '',//次级评论
        parentid: -1,//次级评论父级id
        showCommentInput: false,
	},
	
    async onLoad(option) {
        const postInfo = option.postid ?
            (await getPostById(option.postid)).data.result[0] :
			JSON.parse(wx.getStorageSync('_post'));
            
        const { title, content, realname, user_id, post_id } = postInfo;
        let images = postInfo.images[0] !== '[' ? postInfo.images : JSON.parse(postInfo.images);

        try {
            // 确保数据解析成功后设置到data中
            this.setData({
                images,
            });
        } catch (error) {
            console.error('解析图片数据出错:', error);
        }

        //帖子实匿名
        if (realname) {
            let userinfo = (await getUserInfo(user_id)).data;

            if(realname === 2){
                userinfo.nickname = userinfo.grade + '' + 
                (userinfo.class <= 9 ? '0' + userinfo.class : userinfo.class)
                + userinfo.realname
            }

            this.setData({
                userinfo,
            });
        }
		
        // 自己发的
        if (this.data.currentUserId === user_id) {
            this.setData({
                selfPost: true
            });
		}
		
        this.setData({
            isLiked: wx.getStorageSync('self_like').indexOf(post_id) >= 0
        });
        
        const [likeResult, commentResult] = await Promise.all([
            getLikeAmount(post_id),
            getCommentsByPostid(post_id,this.data.currentUserId)
        ]);
		
        const likes_count = likeResult.data[0]['COUNT(*)'];
		const originComments = commentResult.data.result;
		
        const comments = await Promise.all(originComments.map(async value => {
            const { created_at, user_id, isLiked, likes_count, replies : oriReply } = value;
            const newTime = formatDateString(created_at);
            const userInfo = await getUserInfo(user_id);
			const { avatar_url, nickname } = userInfo.data;
            
            const replies = await Promise.all(oriReply.map(async value => {
                const replyTime = formatDateString(value.created_at)
                const replyUser = await getUserInfo(value.user_id);

                const { avatar_url, nickname } = replyUser.data;

                return {
                    ...value, 
                    created_at: replyTime, 
                    avatar_url, 
                    nickname,
                }
            }))

            return { 
               ...value, 
                created_at: newTime, 
                avatar_url, 
                nickname,
                isLiked, 
                likes_count,
                comments_count: replies.length,
                replies,
            };
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
        const userid = this.data.currentUserId;
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
			
			await deleteLike(postid, userid);
			
            const likeAmount = await getLikeAmount(postid);
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
		
        await postLike(like).then(async res => {
            if (res.data.error === 'User has already liked this post') {
                wx.showToast({
                    title: '已经点赞了哦'
                });
			}
			
            const likeAmount = await getLikeAmount(postid);
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
            userid: this.data.currentUserId,
            comment: commentContent,
            parentid: this.data.parentid >= 0 ? this.data.parentid : null,
            anonymous: this.data.isAnonymous? 1 : 0, 
            postid: this.data.post_id
		};
		
        // 清空输入框和匿名状态
        this.setData({
            commentContent: '',
            isAnonymous: false,
            showCommentInput: false,
            parentid: -1,
        });
        
        //上传回复
        if (this.data.commentType === 'commentComment'){
            postReply(comment)
            .then(res => {
                this.commentRefresh(res) 
            })

            return
        }
            
        // 上传评论
        postComments(comment)
           .then(res => { 
               this.commentRefresh(res) 
            });
    },
    
    async commentRefresh(res) {
        console.log('服务器响应:', res);
        
        const ocm = await getCommentsByPostid(this.data.post_id, this.data.currentUserId);
        const originComments = ocm.data.result;
        
        const comments = await Promise.all(originComments.map(async (comment) => {
            const { created_at, user_id, replies: oriReply = [] } = comment;
            const newTime = formatDateString(created_at);
            const userInfo = await getUserInfo(user_id);
            const { avatar_url, nickname } = userInfo.data;
            
            // 修复：使用Promise.all等待所有回复处理完成
            const replies = await Promise.all(oriReply.map(async (reply) => {
                const replyTime = formatDateString(reply.created_at);
                const replyUserInfo = await getUserInfo(reply.user_id);
                const { avatar_url: replyAvatar, nickname: replyNickname } = replyUserInfo.data;
    
                return {
                    ...reply,
                    created_at: replyTime,
                    avatar_url: replyAvatar,
                    nickname: replyNickname
                };
            }));
    
            return {
                ...comment,
                created_at: newTime,
                avatar_url,
                nickname,
                isLiked: false,
                showCommentInput: false,
                commentContent: '',
                isAnonymous: false,
                likes_count: comment.likes_count || 0,  // 保留原始值
                comments_count: comment.comments_count || 0,  // 保留原始值
                replies  // 使用处理后的回复数组
            };
        }));
        
        this.setData({
            comments_count: comments.length,
            comments
        });
    },

    // 转发帖子
    forwardPost() {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage','shareTimeline']
        });
        console.log('点击转发'); 
	},
	
    // 点击评论按钮显示输入框
    showCommentInput(e) {
        const { type, id } = e.currentTarget.dataset

        //禁止第三级评论
        if (type === 'nextComment') return

        //已经显示了的情况
        if (this.data.showCommentInput){
            //切换状态
            if (this.data.commentType !== type){
                this.setData({
                    commentType: type,
                })

                return
            }

            this.setData({
                commentContent: '',
                isAnonymous: false,
                showCommentInput: false,
                parentid: -1,
            });

            return
        }

        //未显示加载出来
        const newComments = this.data.comments.map(comment => ({
           ...comment,
            showCommentInput: false
        }));
        this.setData({
            showCommentInput: true,
            comments: newComments,
            commentType: type,
            parentid: id ? id : -1,
        });
	},
	
    // 举报帖子
    reportPost() {
        const { post_id } = this.data;
		
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
        wx.navigateTo({
          url: '/pages/report/report?type=posts&id=' + this.data.post_id,
        })
	},
	
    // 点赞评论
    async likeComment(e) {
        const index = e.currentTarget.dataset.index;
        const comment = this.data.comments[index];
        const userid = this.data.currentUserId;
        const commentid = comment.comments_id;
        
        postCommentLike(userid, commentid)

        // 取消点赞
        if (comment.isLiked) {
            const newComments = [...this.data.comments];
            newComments[index].isLiked = false;
            this.setData({
                comments: newComments
            });
            
            // 模拟取消评论点赞操作（没写后端，用AI整了一坨...）
            const newLikesCount = comment.likes_count - 1;
            newComments[index].likes_count = newLikesCount;
            this.setData({
                comments: newComments
            });
            
            return;
        }
        
        const newComments = [...this.data.comments];
        newComments[index].isLiked = true;
        this.setData({
            comments: newComments
        });
        
        // 模拟点赞操作
        const newLikesCount = comment.likes_count + 1;
        newComments[index].likes_count = newLikesCount;
        this.setData({
            comments: newComments
        });
    },
    
    // 举报评论
    reportComment(e) {
        const index = e.currentTarget.dataset.id;

        //删评
        if ( e.currentTarget.dataset.userid === this.data.currentUserId ){
            wx.showModal({
                title: '删评',
                content: '确定要删评吗',
                confirmText: '删除',
                cancelText: '取消',
                success: (res) => {
                    if(res.confirm){
                        deleteComments(index)
                            .then(res => {
                                this.commentRefresh(res) 

                                wx.showToast({
                                    title: '删除成功',
                                    icon: 'success',
                                })
                            })
                    }
                }
            })
            
            return
        }

        wx.navigateTo({
            url: '/pages/report/report?type=comments&id=' + index,
        })
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
	},
});