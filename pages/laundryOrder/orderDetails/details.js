// pages/laundryOrder/orderDetails/details.js
let app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        styleNum:1,
        orderno:'',
        listItme:[]
    },
    getOrderdetail () {
        app.Formdata.get('/openapi/express/wechatapplet/express/wash/order/detail', { orderNo: this.data.orderno}, (res)=>{
            if(res.code=='0000') {
                this.setData({
                    listItme: res.data
                })
            }
        })
    },
    //取消订单
    editStatus(e) {
        let _this = this;
        let orderno = e.target.dataset.orderno;
        let status = e.target.dataset.status;
        wx.showModal({
            title: '温馨提示',
            content: status == 10 ? '确认取消订单吗？' : '确认收到了吗？',
            success(res) {
                if (res.confirm) {
                    app.Formdata.post('/openapi/express/wechatapplet/express/wash/order/editStatus', { 'orderNo': orderno, 'status': status }, (res) => {
                        console.log(res)
                        if (res.code == '0000') {
                            wx.showToast({
                                title: status == 10 ? '取消成功' : '确认成功',
                                success: (res) => {
                                    setTimeout(()=>{
                                        wx.navigateBack({
                                            delta: 1
                                        })
                                    },2000)
                                }
                            })
                        }
                    })
                } else if (res.cancel) {

                }
            }
        })
    },
    //跳转商品页
    golaundryOrder(e) {
        wx.redirectTo({
            url: '/pages/laundryOrder/index/index'
        })
    },
    //跳转支付
    goOrderPeyMent(e) {
        let orderno = e.target.dataset.orderno;
        wx.navigateTo({
            url: '/pages/laundryOrder/payMent/index?orderno=' + res.data.orderNo + '&payType=1'
        })
    },
    //删除
    delOrder(e) {
        let _this = this;
        let orderno = e.target.dataset.orderno;
        wx.showModal({
            title: '温馨提示',
            content: '删除后并不能恢复数据，确定删除？',
            success(res) {
                if (res.confirm) {
                    app.Formdata.post('/openapi/express/wechatapplet/express/wash/order/del', { 'orderNo': orderno }, (data) => {
                        if (data.code == '0000') {
                            wx.showToast({
                                title: '删除成功',
                                success: (res) => {
                                    setTimeout(() => {
                                        wx.navigateBack({
                                            delta: 1
                                        })
                                    }, 2000)
                                }
                            })
                        }
                    })
                } 
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            orderno: options.orderno
        })
        this.getOrderdetail();
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