// pages/shopMall/orderDetails/details.js
let app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        status:1,
        orderno:'',
        detailInfo:null,
        productInfo:null,
        detaText:''
    },
    clickQuestion(e) {
        let phone = e.currentTarget.dataset.phone;
        if (!phone) {
            return false
        }
        wx.showModal({
            title: '客服电话',
            content: phone,
            confirmText: '拨打',
            success(res) {
                if (res.confirm) {
                    wx.makePhoneCall({
                        phoneNumber: phone
                    })
                } else if (res.cancel) {
                }
            }
        })
    },
    goBack(e){
        let orderno = e.currentTarget.dataset.orderno;
        let goodid = e.currentTarget.dataset.goodid;
        wx.navigateTo({
            url: '/pages/shopMall/returnGoods/index?orderno=' + orderno + '&goodid=' + goodid,
        })
    },
    getOrderDetails(){
        wx.showLoading({
            title: '加载中...',
        })
        let _this =  this;
        let detaText='';
        app.FormdataPHP.get('/wxapp/orders/refundDetail', { cancel_no: _this.data.orderno},(res)=>{
            console.log(res)
            if(res.code == '0000'){
                _this.setData({
                    detailInfo:res.data
                })
                wx.hideLoading();
            }
        })
    },
    editStatus(e) {
        let _this = this;
        let orderno = e.target.dataset.orderno;
        wx.showModal({
            title: '温馨提示',
            content: '取消退货申请',
            success(res) {
                if (res.confirm) {
                    app.FormdataPHP.post('/wxapp/orders/cancelRefund', { 'cancel_no': orderno }, (res) => {
                        console.log(res)
                        if (res.code == '0000') {
                            wx.showToast({
                                title: '取消成功',
                            })
                            _this.setData({
                                page: 1,
                                listItme: []
                            })
                            _this.getOrderDetails();
                        }
                    })
                } else if (res.cancel) {

                }
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        if (options.orderno) {
            this.setData({
                orderno: options.orderno
            },()=>{
                this.getOrderDetails();
            })
        }
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
        
        this.getOrderDetails();
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