// pages/usCenter/index.js
let app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isShow: false,
        isLogin: false,
        wxUserInfo: {},
        rechargeMember: '',
        rechargeUserInfo: ''
    },
    //跳转创建会员订单
    goPaymenber() {
        wx.navigateTo({
            url: '/pages/memberInfo/openMember/index?rechargeUserInfo=' + JSON.stringify(this.data.rechargeUserInfo),
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let userInfo = app.UserLogin.get('userInfo')
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let wxInfo = app.UserLogin.get('wxUserInfo');
        let userInfo = app.UserLogin.get('userInfo');
        this.setData({
            isShow: !wxInfo,
            isLogin: userInfo,
            isTest: userInfo.mobile == '13139696803' ? false : true
        })
        if (wxInfo) {
            this.setData({
                wxUserInfo: app.UserLogin.get('userInfo'),
                wxInfo: app.UserLogin.get('wxUserInfo'),
            })
        }
        app.Formdata.get('/openapi/express/wechatapplet/express/user/rechargeUserInfo', {
            userNo: userInfo.userNo
        }, (res) => {
            if (res.code == "0000" && res.data) {
                this.setData({
                    rechargeUserInfo: res.data,
                    rechargeMember: res.data.rechargeMember
                }, () => {
                    if (this.data.rechargeUserInfo.endTime) {
                        this.setData({
                            'rechargeUserInfo.endTime': this.data.rechargeUserInfo.endTime.substring(0, 10)
                        })
                    }
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})