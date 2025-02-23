// app.js
App({
  onShow() {

    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    console.log(wx.getStorageSync('user_info'))
    if (!wx.getStorageSync('user_info')) {
        wx.navigateTo({
            url: '/pages/login/login',
        })
    }

    wx.cloud.init({
        resourceAppid: 'wxac8615ce0828beeb',
        resourceEnv: 'prod-9ggzinxb5b8ff0c5', 
        traceUser: true,
    });
    
  },
  globalData: {
    userInfo: null
  },
})
