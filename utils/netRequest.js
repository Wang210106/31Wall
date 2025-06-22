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