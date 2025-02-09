// index.js

Page({
    onLoad:function(){
        if (!wx.getStorageSync('storage_info')) {
            wx.redirectTo({
                url: '/pages/login/login',
                complete(res){
                    console.log(res)
                },
            })
        }
    },
})
