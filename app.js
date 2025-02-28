// app.js
App({
  onLaunch() {

    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    wx.cloud.init({
        resourceAppid: 'wxac8615ce0828beeb',
        resourceEnv: 'prod-9ggzinxb5b8ff0c5', 
        traceUser: true,
    });

    if (!wx.getStorageSync('user_info')) {
        wx.navigateTo({
            url: '/pages/login/login',
        })
    }
    else{
        wx.cloud.callContainer({
            "config": {
              "env": "prod-9ggzinxb5b8ff0c5"
            },
            "path": "/user/",
            "header": {
              "X-WX-SERVICE": "express-41pr"
            },
            "method": "GET",
        }).then(res => {
            wx.setStorageSync('user_info', res.data)

            console.log(wx.getStorageSync('user_info'))
        })
    }
    
  },

  globalData: {
    userInfo: null
  },
})
