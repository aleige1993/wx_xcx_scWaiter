// pages/laundryOrder/shoppCart/index.js
let app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        result:[],
        isAll: false,
        dataLength:0,
        pageList:{
            page:1,
            limit:15
        },
        resData:[],
        allPirce:0
    },
    onCheckbox(e){
        this.setData({
            result: e.detail
        });
        if (this.data.dataLength == this.data.result.length && this.data.dataLength  != 0){
            this.setData({
                isAll:true
            });
        }else{
            this.setData({
                isAll: false,
                allPirce: 0
            });
        }
        this.getAllprice();
    },
    allCheckbox(e) {
        this.setData({
            isAll: !this.data.isAll
        })
        if (this.data.isAll) {
            let pushArr = []
            this.data.resData.map((item) => {
                pushArr.push(item.id)
            })
            this.setData({
                result: pushArr
            })
            this.getAllprice();
        }else{
            this.setData({
                result: [],
                allPirce:0
            })
        }
    },
    onStepper(e){
        let goodno = e.target.dataset.goodno;
        let inxNum = e.detail;
        app.Formdata.post('/openapi/express/wechatapplet/wash/cart/update', { 'productNo': goodno, 'num':inxNum},(res)=>{
            if(res.code=='0000'){
                this.getAllprice();
            }
        })
    },
    //获取金额
    getAllprice(){
        app.Formdata.get('/openapi/express/wechatapplet/wash/cart/total', { ids: this.data.result},(res)=>{
            if(res.code=='0000'){
                this.setData({
                    allPirce: res.data.totalAmount
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    //首次获取
    getGoodshop(){
        let _this = this;
        wx.showLoading({
            title: '加载中...',
        })
        app.Formdata.get('/openapi/express/wechatapplet/wash/cart/query', this.data.pageList, (res) => {
            if (res.code == '0000') {
                _this.setData({
                    'resData': res.data,
                    'dataLength': res.data.length
                })
            }
            wx.hideLoading()
        })
    },
    //删除
    onCaler (e) {
        if (this.data.result.length>0){
            app.Formdata.get('/openapi/express/wechatapplet/wash/cart/del', { ids: this.data.result }, (res) => {
                if(res.code=='0000') {
                    this.setData({
                        result: [],
                        allPirce: 0,
                        isAll:false
                    })
                    wx.showToast({
                        title: '删除成功~',
                        success:(res)=>{
                            this.getGoodshop();
                            this.getAllprice();
                        }
                    })
                }
            })
        }else{
            wx.showToast({
                title: '请勾选商品',
                icon:'none'
            })
        }
    },
    //去洗衣
    setOrder(){
        if (this.data.result.length > 0) {
            wx.navigateTo({
                url: '/pages/laundryOrder/setTlement/index?ids=' + this.data.result
            })
        }else{
            wx.showToast({
                title: '请勾选商品',
                icon: 'none'
            })
        }
    },
    onLoad: function (options) {
        this.getGoodshop();
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