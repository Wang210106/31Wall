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
    getUserProfile(e) {
      wx.getUserProfile({
        desc: '用于完善会员资料', 
        success: (res) => {
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          wx.setStorageSync('storage_info',1);

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
    },    
  })