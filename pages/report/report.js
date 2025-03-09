Page({
    data: {
        reportContent: '',
        reportReasons: ['不当言论', '虚假信息', '暴力内容', '违规信息', '恶意攻击', '散布谣言'],
        selectedReasonIndex: 0,
        errorMessage: '',

        type: '',
        id: 0,
    },
   
    onLoad(op){
        this.setData({
            type: op.type,
            id: +op.id,
        })
    },

    handleInput(e) {
        this.setData({
            reportContent: e.detail.value
        });
    },
   
    handleReasonChange(e) {
        this.setData({
            selectedReasonIndex: e.detail.value
        });
    },
   
    submitReport() {
        const { reportContent, reportReasons, selectedReasonIndex, type, id } = this.data;
    
        if (!reportContent) {
            this.setData({
                errorMessage: '请填写完整举报内容和选择举报原因'
            });
            return;
        }

        this.postReport({
            user_id: wx.getStorageSync('user_info').userid,
            content: '#' + reportReasons[selectedReasonIndex] + '\'' + this.data.reportContent,
            type,
            marked_id: id,
        }).then(res => {
            if(res.statusCode !== 200){
                return wx.showToast({
                  title: '上传失败',
                  icon: 'error'
                })
            }

            wx.showToast({
              title: '上传成功',
              icon: 'success'
            })

            wx.navigateBack({
                delta: 1,
            })
        })
    },
    
    postReport(report) {
        return wx.cloud.callContainer({
            config: {
                env: 'prod-9ggzinxb5b8ff0c5'
            },
            path: `/report`,
            header: {
                'X-WX-SERVICE': 'express-41pr'
            },
            method: 'POST',
            data: report
        });
    },
});