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
	},
  
	async onLoad(option) {
        const postInfo = option.postid ? 
        (await this.getPostById(option.postid)).data.result[0] :  JSON.parse(wx.getStorageSync('_post'))
        console.log(postInfo)

        const { title, content, realname, user_id, post_id } = postInfo;
        let images = postInfo.images

        if(typeof images === 'string'){
            images = JSON.parse(images)
        }

        if(realname){
            const userinfo = await this.getUserById(user_id)

            this.setData({
                userinfo: userinfo.data,
            })
        }

        const [likeResult, commentResult] = await Promise.all([
            this.getLikeAmount(post_id),
            this.getCommentAmount(post_id)
        ]);
     
        const likes_count = likeResult.data[0]['COUNT(*)'];
        const comments_count = commentResult.data[0]['COUNT(*)'];

        this.setData({
            title,
            content,
            images,
            postTime: postInfo.post_time || formatDateString(postInfo.created_at),
            post_id,
            likes_count,
            comments_count,
        });
	},

	// 点赞功能
	likePost() {
	  // 点赞逻辑
	    console.log('点赞成功');
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
	  user_id: wx.getStorageSync('user_info').id,
	  content: commentContent,
      anonymous: this.data.isAnonymous,
      post_id : this.data.post_id,
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
    },
    
    getLikeAmount(postid){
        return wx.cloud.callContainer({
            "config": {
            "env": "prod-9ggzinxb5b8ff0c5"
            },
            "path": "/post/like/amount?postid="+postid,
            "header": {
            "X-WX-SERVICE": "express-41pr"
            },
            "method": "GET",
        })
    },

    getCommentAmount(postid){
        return wx.cloud.callContainer({
            "config": {
            "env": "prod-9ggzinxb5b8ff0c5"
            },
            "path": "/post/comment/amount?postid="+postid,
            "header": {
            "X-WX-SERVICE": "express-41pr"
            },
            "method": "GET",
        })
    },

    getUserById(userid){
        return wx.cloud.callContainer({
            "config": {
            "env": "prod-9ggzinxb5b8ff0c5"
            },
            "path": "/user/userid?userid=" + userid,
            "header": {
            "X-WX-SERVICE": "express-41pr"
            },
            "method": "GET",
        })
    },

    getPostById(postid){
        return wx.cloud.callContainer({
            "config": {
            "env": "prod-9ggzinxb5b8ff0c5"
            },
            "path": "/post?postid=" + postid,
            "header": {
            "X-WX-SERVICE": "express-41pr"
            },
            "method": "GET",
        })
    },

});