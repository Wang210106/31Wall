// pages/my/setting/setting.js
Page({

    data: {
        "items" : [
            { id : 0 , text : "用户信息" , iconfont : "icon-yonghu" },
			{ id : 1 , text : "退出登录" , iconfont : "icon-tuichudenglu" },
			{ id : 2 , text : "开发者模式" , iconfont : "icon-jishuzhichi" },
        ],
    },

    itemtap: function(e) {
        if (e.detail.type === 0){
            //用户信息
            wx.navigateTo({
                url: '/pages/my/userInfo/userInfo',
            })
        }
        else if (e.detail.type === 1){
            //退出登录
            wx.removeStorageSync('user_info')
            
            wx.navigateTo({
              url: '/pages/login/login',
              success(){
                console.log("logout")
              }
            })
        }
        else if (e.detail.type === 2){
            //检测权限
            if(wx.getStorageSync('user_info').status > 0){
                wx.navigateTo({
                    url: '/pages/developer/developer',
                })
            } 
        }
    }
})