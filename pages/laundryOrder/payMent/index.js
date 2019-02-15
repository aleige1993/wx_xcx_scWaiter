// pages/laundryOrder/payMent/index.js
let app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderno:'',
        listItme:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        this.setData({
            orderno: options.orderno
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