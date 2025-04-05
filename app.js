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
    userInfo: null,
    kingkongList: [
        { id: 0, icon: 'icon-biaobaiqiangpinglunqudianzan.png', text: '表白墙', active: false },
        { id: 1, icon: 'icon-zizhuxuexi.png', text: '学习互助', active: false },
        { id: 2, icon: 'icon-a-ziyuan5.png', text: '扩列', active: false },
        { id: 3, icon: 'icon-shiwuzhaoling.png', text: '失物招领', active: false }
    ],
  },
})
