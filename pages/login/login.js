Page({
    data: {
      userInfo: {},
      hasUserInfo: false,
      canIUseGetUserProfile: false,
    },
    onLoad() {
      if (wx.getUserProfile) {
        this.setData({
          canIUseGetUserProfile: true
        })
      }
    },
    getUserProfile() {
        wx.getUserProfile({
            desc: '用于完善会员资料', 
            success: (res) => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })

                wx.login({
                    success(loginRes){
                        wx.setStorageSync('storage_info',1);
                        console.log(loginRes.code,res.userInfo)
        
                        wx.switchTab({
                            url: '/pages/index/index',
                            success(){
                                console.log("success to login")
                            },
                            fail(){
                                console.log("fail to login")
                            }
                        })
                    }
                })
                //回调地狱！！！
                //凭什么不支持promise语法
            }
        })
    },    
  })