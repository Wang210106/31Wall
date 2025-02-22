// app.js
App({
  async onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    if (!wx.getStorageSync('storage_info')) {
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
