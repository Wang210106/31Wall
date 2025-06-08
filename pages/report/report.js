const reasons = {
    postsReasons: ['不当言论', '虚假信息', '违规信息', '恶意攻击'],
    connectReasons: ['功能问题', '界面与用户体验', '信息错误', '安全与隐私', '改进与建议', '其他'],
    commentsReasons: ['不当言论', '虚假信息', '违规信息', '恶意攻击'],
}

Page({
    data: {
        reportContent: '',
        selectedReasonIndex: 0,
        errorMessage: '',
        reportReasons: [],
        otherReason: '',
        type: '',
        id: -1,
        qaList: [
            { question: '内测期间请不要通过此渠道上报问题，可以通过微信群内文档统一上报，便于汇总', answer: '谢谢大家！！！', isOpen: true },
			{ question: '什么时候上线', answer: '短时间内不会，敬请期待', isOpen: false },
			
        ]
    },

    onLoad(op) {
        this.setData({
            type: op.type,
            id: +op.id,
            reportReasons: reasons[op.type + 'Reasons']
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

    handleOtherReasonInput(e) {
        this.setData({
            otherReason: e.detail.value
        });
    },

    submitReport() {
        const { reportContent, reportReasons, selectedReasonIndex, type, id, otherReason } = this.data;

        if (!reportContent) {
            this.setData({
                errorMessage: '请填写完整反馈内容和选择反馈原因'
            });
            return;
        }

        let content = '#' + reportReasons[selectedReasonIndex] + '\'' + reportContent;
        if (reportReasons[selectedReasonIndex] === '其他' && otherReason) {
            content += ' - ' + otherReason;
        }

        this.postReport({
            user_id: wx.getStorageSync('user_info').userid,
            content,
            type,
            marked_id: id,
        }).then(res => {
            if (res.statusCode!== 200) {
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

    toggleAnswer(e) {
        const index = e.currentTarget.dataset.index;
        const qaList = this.data.qaList;
        qaList[index].isOpen =!qaList[index].isOpen;
        this.setData({
            qaList
        });
    }
});
    