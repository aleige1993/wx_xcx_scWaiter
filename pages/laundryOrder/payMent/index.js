// pages/laundryOrder/payMent/index.js
let app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderno:'',
        payType:'',
        listItme:[]
    },
    payment(e){
        let _this = this;
        wx.login({
            success(res) {
                if (res.code) {
                    console.log(res.code)
                    let prmes = {
                        code: res.code,
                        clientIp: '127.0.0.1',
                        type: _this.data.payType,
                        out_trade_no: _this.data.orderno
                    }
                    app.Formdata.post('/openapi/express/wechatapplet/express/wxpay/launch', prmes, (rult) => {
                        console.log(rult)
                    })
                }
            }
        })
      
       
       
        // wx.requestPayment({
        //     timeStamp: '1550476450',
        //     nonceStr: '6967739600917534337124595306044',
        //     package: 'prepay_id=wx181554080742275b9e0f13410901786223',
        //     signType: 'MD5',
        //     paySign: 'D1A9DFB6A629036CA4E92A611D469A9E',
        //     success(res) { 
        //         console.log('res',res)
        //     },
        //     fail(err) {
        //         console.log('err',err)
        //      }
        // })
    },
    /**
     * 生命周期函数--监听页面加载 
     */
    onLoad: function (options) {
        this.setData({
            orderno: options.orderno,
            payType: options.payType
        })
      
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        app.Formdata.get('/openapi/express/wechatapplet/express/wash/order/payPage', { orderNo: this.data.orderno},(res)=>{
            if(res.code=="0000") {
                this.setData({
                    listItme:res.data
                })
            }
        })
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