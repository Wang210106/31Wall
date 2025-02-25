import { containsEmptyItem } from '../../utils/objectOperate'
import { generateUniqueFileName } from '../../utils/randomName'

Page({
    data: {
        hasUserInfo: false,
        hasSignedUp: false,

        formData: {
            avatar_url: 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132',
            nickname: '',
            realName: '',
            grade: '25',
            class: '1',
            gender: 0
        },

        grade: ['25', '26', '27'],
        class: Array.from({ length: 16 }, (_, i) => i + 1),
        selectedGrade: 0,
        selectedClass: 0,
        //'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132'
        AvatarUrl : 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132',
    },

    getUserProfile(e) {
        wx.getUserProfile({//仅用来查看是否注册
            desc: '用于获取登录信息',

            success: () => {
                this.isUserExisted()
                .then(res => {
                    const isSigned = !res.data.message
                
                    if(isSigned){//这里是已经注册的情况
                        this.setData({
                            hasSignedUp: true,
                        })

                        wx.setStorageSync('user_info', res.data)

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
                        hasUserInfo: true,
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

        //检验空白项
        if(containsEmptyItem(formData)){
            wx.showToast({
                title: '不能有空白项',
                icon: 'error',
                duration: 2000
            })

            return;
        }

        //看昵称长度
        if(formData.nickname.length > 20){
            wx.showToast({
                title: '昵称太长了呢，',
                icon: 'none',
                duration: 2000
            })

            return
        }

        //检验姓名合法性
        const regex = /^[\u4E00-\u9FFF]{2,4}$/;

        if(!regex.test(formData.realName)){
            wx.showToast({
                title: '真的是你的名字吗',
                icon: 'none',
                duration: 2000
            })

            return
        }

        //提交网络请求
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
    },

    onChooseAvatar(e) {
        const { avatarUrl } = e.detail 
        
        const extension = avatarUrl.split('.')[avatarUrl.split('.').length - 1]

        wx.cloud.uploadFile({
            cloudPath: 'avatarImage/' + generateUniqueFileName(extension),
            filePath: avatarUrl,
            config: {
                env: 'prod-9ggzinxb5b8ff0c5'
            }
        }).then(res => {
            this.setData({
                AvatarUrl: res.fileID,
                formData: {
                    ...this.data.formData, 
                    avatar_url: res.fileID,
                }
            })
        })
    },
});
