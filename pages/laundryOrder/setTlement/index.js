// pages/laundryOrder/setTlement/index.js
let app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        shopArr: [],
        shopIndex: '',
        listItme:[],
        val:'',
        ids:[]
    },
    // 选择店铺
    shoprChange(e) {
        console.log(e.detail.value)
        this.setData({
            shopIndex: e.detail.value
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    //获取小站列表
    //获取多输入框
    blurtext(e){
        this.setData({
            val: e.detail.value
        })
    },
    getAdderquery() {
        app.Formdata.get('/openapi/express/wechatapplet/express/station/query',{},(res) =>{
            this.setData({
                shopArr:res.data
            })
        })
    },
    orderAdd() {
        if (!this.data.shopIndex){
            wx.showToast({
                title: '请选择小站',
                icon:'none'
            })
            return false
        }
        let parman = {
            message: this.data.val,
            ids: this.data.ids,
            stationNo: this.data.shopArr[this.data.shopIndex].stationNo
        }
        app.Formdata.post('/openapi/express/wechatapplet/express/wash/order/add', parman ,(res) =>{
            console.log(res)
            if(res.code=="0000") {
                wx.redirectTo({
                    url: '/pages/laundryOrder/payMent/index?orderno=' + res.data.orderNo+'&payType=1'
                })
            }
        })
    },
    onLoad: function (options) {
        wx.showLoading({
            title: '加载中...',
        })
        let ids = options.ids.split(',');
        this.getAdderquery();
        app.Formdata.get('/openapi/express/wechatapplet/express/wash/order/showPre', { ids: ids},(res)=>{
            console.log(res)
            if(res.code=="0000") {
                this.setData({
                    listItme:res.data,
                    ids: ids
                })
            }
        });
        wx.hideLoading();
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