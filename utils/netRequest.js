export function postLike(comment) {
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
}

export function deleteLike(postid, userid) {
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
}

export function getLikeAmount(postid) {
	return wx.cloud.callContainer({
	"config": {
		"env": "prod-9ggzinxb5b8ff0c5"
	},
	"path": "/post/like/amount?postid=" + postid,
	"header": {
		"X-WX-SERVICE": "express-41pr"
	},
	"method": "GET",
	})
}

export function getCommentAmount(postid) {
	return wx.cloud.callContainer({
	"config": {
		"env": "prod-9ggzinxb5b8ff0c5"
	},
	"path": "/post/comment/amount?postid=" + postid,
	"header": {
		"X-WX-SERVICE": "express-41pr"
	},
	"method": "GET",
	})
}

export function getUserInfo(userid) {
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
}

export function getLikeByUserid(userid) {
	return wx.cloud.callContainer({
	"config": {
		"env": "prod-9ggzinxb5b8ff0c5"
	},
	"path": "/post/like/userid?userid=" + userid,
	"header": {
		"X-WX-SERVICE": "express-41pr"
	},
	"method": "GET",
	})
}

export function getPostsByTab(tab, page) {
	return wx.cloud.callContainer({
	"config": {
		"env": "prod-9ggzinxb5b8ff0c5"
	},
	"path": "/post/tab?tab=" + encodeURIComponent(tab) + '&page=' + page,
	"header": {
		"X-WX-SERVICE": "express-41pr"
	},
	"method": "GET",
	})
}

export function getPosts(page) {
	return wx.cloud.callContainer({
		"config": {
			"env": "prod-9ggzinxb5b8ff0c5"
		},
		"path": "/post/all?page=" + page,
		"header": {
			"X-WX-SERVICE": "express-41pr"
		},
		"method": "GET",
	})
}

export function getPostById(postid) {
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
}

export function deletePostById(postid) {
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
}

export function postComments(comment) {
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
}

export function postReply(comment) {
	return wx.cloud.callContainer({
		config: {
			env: 'prod-9ggzinxb5b8ff0c5'
		},
		path: '/comment/reply',
		header: {
			'X-WX-SERVICE': 'express-41pr'
		},
		method: 'POST',
		data: comment
	});
}

export function postCommentLike(userid, commentid) {
	return wx.cloud.callContainer({
		config: {
			env: 'prod-9ggzinxb5b8ff0c5'
		},
		path: `/post/commentLike?userid=${userid}&commentid=${commentid}`,
		header: {
			'X-WX-SERVICE': 'express-41pr'
		},
		method: 'POST',
	});
}

export function getCommentsByPostid(postid,userid) {
	return wx.cloud.callContainer({
		config: {
			env: 'prod-9ggzinxb5b8ff0c5'
		},
		path: `/post/comment/postid?postid=${postid}&userid=${userid}`,
		header: {
			'X-WX-SERVICE': 'express-41pr'
		},
		method: 'GET'
	});
}

export function deleteComments(commentid) {
	return wx.cloud.callContainer({
		config: {
			env: 'prod-9ggzinxb5b8ff0c5'
		},
		path: `/post/comment?commentid=${commentid}`,
		header: {
			'X-WX-SERVICE': 'express-41pr'
		},
		method: 'DELETE'
	});
}

export function getPostsByUserid(userid){
	return wx.cloud.callContainer({
		"config": {
			"env": "prod-9ggzinxb5b8ff0c5"
		},
		"path": "/post/userid?userid=" + userid,
		"header": {
			"X-WX-SERVICE": "express-41pr"
		},
		"method": "GET",
	})
}

export function getLikesByPostid(postid){
	return wx.cloud.callContainer({
		"config": {
			"env": "prod-9ggzinxb5b8ff0c5"
		},
		"path": "/post/like/postid?postid=" + postid,
		"header": {
			"X-WX-SERVICE": "express-41pr"
		},
		"method": "GET",
	})
}

export function getNoticeByUserid(userid){
	return wx.cloud.callContainer({
		"config": {
			"env": "prod-9ggzinxb5b8ff0c5"
		},
		"path": "/report/notice?userid=" + userid,
		"header": {
			"X-WX-SERVICE": "express-41pr"
		},
		"method": "GET",
	})
}
