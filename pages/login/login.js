import { containsEmptyItem } from '../../utils/objectOperate'

Page({
    data: {
        userInfo: {},
        hasUserInfo: false,
        hasSignedUp: false,

        formData: {
            avatar_url: '',
            nickname: '',
            realName: '',
            grade: '25',
            class: '1'
        },
        grade: ['25', '26', '27'],
        class: Array.from({ length: 16 }, (_, i) => i + 1),
        selectedGrade: 0,
        selectedClass: 0
    },

    getUserProfile(e) {
        wx.getUserProfile({
            desc: '用于完善会员资料', 
            success: res => {
                this.isUserExisted()
                .then(res => res.data)
                .then(isSigned => {//这里是重新登录
                    if(!isSigned.message){//这里是已经注册的情况
                        this.setData({
                            hasSignedUp: true,
                        })

                        this.updateUser({
                            nickName: res.userInfo.nickName,
                            avatar_url: res.userInfo.avatarUrl,
                        })

                        wx.setStorageSync('user_info', {
                            avatar_url: isSigned.avatar_url,
                            nickName: res.userInfo.nickName,
                            avatar_url: res.userInfo.avatarUrl,
                            userid: isSigned.id,
                            openid: isSigned.openid,
                            realName: isSigned.realname,
                            class: isSigned.class,
                            grade: isSigned.grade,
                            gender: isSigned.gender
                        })

                        wx.switchTab({
                            url: '/pages/index/index',
                            success(){
                                console.log("success to login")
                            },
                            fail(){
                                console.log("fail to login")
                            }
                        })

                        return
                    }

                    //这里是还没注册的情况
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true,
    
                        formData: { 
                            ...this.data.formData, 
                            nickname: res.userInfo.nickName,
                            avatar_url: res.userInfo.avatarUrl,
                            gender: res.userInfo.gender
                        }
                    })
                })
            }
        })
    },    

    updateFormData(e) {
        const { field } = e.currentTarget.dataset;
        let { formData } = this.data;
     
        if (e.type === 'input') {
            formData[field] = e.detail.value;
        } else if (e.type === 'change') {
            formData[field] = this.data[field][e.detail.value];
            if (field === 'grade') {
                this.setData({ selectedGrade: e.detail.value });
            } else if (field === 'class') {
                this.setData({ selectedClass: e.detail.value });
            }
        }
     
        this.setData({ formData });
    },

    submitForm() {
        const { formData } = this.data;

        if(containsEmptyItem(formData)){
            wx.showToast({
                title: '不能有空白项',
                icon: 'error',
                duration: 2000
            })

            return;
        }

        this.postUser(formData)
        .then(res => {
            console.log(res)
            if(res.statusCode !== 200){
                wx.showToast({
                    title: '提交失败',
                    icon: 'error',
                    duration: 2000
                });

                return null;
            }

            wx.showToast({
                title: '提交成功',
                icon: 'success',
                duration: 2000
            });

            return res.data
        })
        .then(data => {
            if(!data) return

            wx.setStorageSync('user_info',{ ...formData, userid: data.id });

            console.log('成功注册：',wx.getStorageSync('user_info'))

            wx.switchTab({
                url: '/pages/index/index',
                success(){
                    console.log("success to login")
                },
                fail(){
                    console.log("fail to login")
                }
            })
        })

        //回调地狱 
    },

    postUser(userInfo){
        return wx.cloud.callContainer({
            "config": {
                "env": "prod-9ggzinxb5b8ff0c5"
            },
            "path": "/user/",
            "header": {
                "X-WX-SERVICE": "express-41pr"
            },
            "method": "POST",
            "data" : userInfo
        })
    },

    updateUser(userInfo){
        return wx.cloud.callContainer({
            "config": {
                "env": "prod-9ggzinxb5b8ff0c5"
            },
            "path": "/user/update",
            "header": {
                "X-WX-SERVICE": "express-41pr"
            },
            "method": "POST",
            "data" : userInfo
        })
    },

    isUserExisted(){
        return wx.cloud.callContainer({
            "config": {
                "env": "prod-9ggzinxb5b8ff0c5"
            },
            "path": "/user/",
            "header": {
                "X-WX-SERVICE": "express-41pr"
            },
            "method": "GET"
        })
    }
});
