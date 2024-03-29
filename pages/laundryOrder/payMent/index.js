// pages/laundryOrder/payMent/index.js
let app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderno: '',
        payType: '',
        listItme: [],
        loading:true
    },
    payment(e) {
        app.Tools.getFormID(e); 
        let _this = this;
        _this.setData({
            loading:false
        })
        wx.login({
            success(res) {
                if (res.code) {
                    let prmes = {
                        code: res.code,
                        type: _this.data.payType,
                        out_trade_no: _this.data.orderno
                    }
                    app.Formdata.post('/openapi/express/wechatapplet/express/wxpay/launch', prmes, (rult) => {
                        if (rult.code == '0000') {
                            wx.requestPayment({
                                timeStamp: rult.data.timeStamp,
                                nonceStr: rult.data.nonceStr,
                                package: rult.data.repay_id,
                                signType: rult.data.signType,
                                paySign: rult.data.paySign,
                                success(res) {
                                    wx.redirectTo({
                                        url: '/pages/laundryOrder/payMent/resultMsg/index?orderno=' + _this.data.orderno + '&payType=' + _this.data.payType + '&result=success',
                                    })
                                },
                                fail(err) {
                                    wx.redirectTo({
                                        url: '/pages/laundryOrder/payMent/resultMsg/index?orderno=' + _this.data.orderno + '&payType=' + _this.data.payType + '&result=fail',
                                    })
                                },
                                complete(data){
                                    _this.setData({
                                        loading: true
                                    })
                                }
                            })
                        } else {
                            wx.showModal({
                                content: '支付失败',
                                showCancel: false,
                                confirmText: '我知道了',
                                success(res) {
                                    if (res.confirm) {
                                        wx.navigateBack({
                                            delta: 1
                                        })
                                    }
                                }
                            })
                        }
                    })
                }
            },
            fail(err){
                wx.showToast({
                    title: 'code获取失败',
                    icon:'none'
                })
                return false
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载 
     */
    onLoad: function(options) {
        this.setData({
            orderno: options.orderno,
            payType: options.payType
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        app.Formdata.get('/openapi/express/wechatapplet/express/wash/order/payPage', {
            orderNo: this.data.orderno,
            type: this.data.payType
        }, (res) => {
            if (res.code == "0000") {
                this.setData({
                    listItme: res.data
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})