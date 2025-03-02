const { containsEmptyItem } = require("../../../utils/objectOperate")
const { generateUniqueFileName } = require("../../../utils/randomName")

// pages/my/userInof/userInfo.js
Page({
    data : {
        Grade: [25, 26, 27],
        Class: Array.from({ length: 16 }, (_, i) => i + 1),
        selectedGrade: 0,
        selectedClass: 0,

        realname: '',
        nickname: '',
        AvatarUrl : 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132',
    },

    onLoad(){
        const info = wx.getStorageSync('user_info')

        this.setData({
            realname: info.realname,
            nickname: info.nickname,
            selectedClass : this.data.Class.indexOf(info.class),
            selectedGrade : this.data.Grade.indexOf(info.grade),
            AvatarUrl: info.avatar_url,
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
            })
        })
    },

    updateFormData(e) {
        if(e.type === 'change'){
            const field = e.currentTarget.dataset.field;
            const value = +e.detail.value

            this.setData({
                ['selected' + field] : value
            })
        }
        else if(e.type === 'input'){
            const field = e.currentTarget.dataset.field;
            const value = e.detail.value

            this.setData({
                [field] : value
            })
        }
    },

    submitForm() {
        const formData = {
            avatar_url: this.data.AvatarUrl,
            nickname: this.data.nickname,
            realname: this.data.realname,
            grade: this.data.Grade[this.data.selectedGrade],
            class: this.data.Class[this.data.selectedClass],
        }

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

        if(!regex.test(formData.realname)){
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

            const userid = wx.getStorageSync('user_info').userid
            wx.setStorageSync('user_info',{ ...formData, userid, });

            console.log('成功修改：',data)
        })

        //回调地狱 
    },

    postUser(userInfo){
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
})
