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
    goToRefund(e){
        let orderno = e.currentTarget.dataset.orderno;
        wx.navigateTo({
            url: '/pages/shopMall/returnOrder/details?orderno=' + orderno,
        })
    },
    getOrderDetails(){
        wx.showLoading({
            title: '加载中...',
        })
        let _this =  this;
        let detaText='';
        app.FormdataPHP.get('/wxapp/orders/detail', { order_no: _this.data.orderno},(res)=>{
            console.log(res)
            if(res.code == '0000'){
                _this.setData({
                    detailInfo:res.data
                })
                if (res.data.expire_tm>0){
                    let leftTime = Math.abs(res.data.expire_tm);
                    var interval = setInterval(function () {
                        leftTime--;
                        let days = parseInt(leftTime / 60 / 60 / 24, 10);
                        let hours = parseInt(leftTime / 60 / 60 % 24, 10);
                        let minutes = parseInt(leftTime / 60 % 60, 10);
                        let seconds = parseInt(leftTime % 60, 10);
                        if (days>0){
                            detaText = days + '天' + hours + '时' + minutes + '分' + seconds + '秒'
                        } else if (hours>0){
                            detaText = hours + '时' + minutes + '分' + seconds + '秒'
                        } else if (minutes > 0){
                            detaText = minutes + '分' + seconds + '秒'
                        } else if (seconds > 0){
                            detaText = seconds + '秒'
                        }
                        _this.setData({
                            detaText: detaText
                        })
                        if (leftTime < 1) {
                            clearInterval(interval);
                            _this.setData({
                                'detailInfo.type' : 5
                            })
                        }
                    }, 1000)
                }
               setTimeout(()=>{
                   wx.hideLoading();
               },1000)
            }
        })
    },
    editStatus(e) {
        let _this = this;
        let orderno = e.target.dataset.orderno;
        let stutes = e.target.dataset.stutes;
        let mas = '';
        switch (stutes) {
            case '1':
                mas = {
                    url: '/wxapp/orders/cancel',
                    content: '确认取消订单吗?',
                    title: '取消成功'
                }
                break;
            case '2':
                mas = {
                    url: '/wxapp/orders/sure',
                    content: '确认收到货了?',
                    title: '确认成功'
                }
                break;
        }
        wx.showModal({
            title: '温馨提示',
            content: mas.content,
            success(res) {
                if (res.confirm) {
                    app.FormdataPHP.post(mas.url, { 'order_no': orderno }, (res) => {
                        console.log(res)
                        if (res.code == '0000') {
                            wx.showToast({
                                title: mas.title,
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
    golaundryOrder(e) {
        wx.switchTab({
            url: '/pages/shopMall/index'
        })
    },
    goOrderPeyMent(e) {
        wx.showLoading({
            title: '调起支付中...',
            mask: true
        })
        let orderno = e.target.dataset.orderno;
        app.FormdataPHP.post('/wxapp/orders/pay', { order_no: orderno }, (res) => {
            if (res.code == '0000') {
                let data = res.data.pay;
                wx.requestPayment({
                    timeStamp: data.timeStamp,
                    nonceStr: data.nonceStr,
                    package: data.package,
                    signType: data.signType,
                    paySign: data.paySign,
                    success(res) {
                        this.getOrderDetails();
                    },
                    fail(res) {
                        wx.showToast({
                            title: '支付失败',
                            icon: 'none'
                        })
                    }
                })
            }
        })
        setTimeout(() => {
            wx.hideLoading();
        }, 2000);
        // wx.navigateTo({
        //     url: '/pages/laundryOrder/payMent/index?orderno=' + orderno + '&payType=1'
        // })
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