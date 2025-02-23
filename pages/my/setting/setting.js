// pages/my/setting/setting.js
Page({

    data: {
        "items" : [
            { id : 0 , text : "用户信息" , iconfont : "icon-yonghu" },
            { id : 1 , text : "退出登录" , iconfont : "icon-tuichudenglu" },
        ],
    },

    itemtap: function(e) {
        if (e.detail.type === 0){
            //用户信息
        }
        else if (e.detail.type === 1){
            //退出登录
            wx.setStorageSync('last_user_info', wx.getStorageSync('user_info'))
            wx.removeStorageSync('user_info')
            
            wx.navigateTo({
              url: '/pages/login/login',
              success(){
                console.log("logout")
              }
            })
        }
    }
})