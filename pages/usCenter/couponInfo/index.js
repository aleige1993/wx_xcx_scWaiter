// pages/usCenter/couponInfo/index.js
let  app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        service:1,
        status:1,
        couponList: [],
        excNum: ''
    },
    getExcnum(e) {
        console.log(e);
        let excNum = e.detail.value;
        this.setData({
            excNum: excNum
        })
    },
    onExcNum(e) {
        let _this = this;
        let excNum = _this.data.excNum;
        if (_this.data.excNum == '') {
            wx.showToast({
                title: '请输入兑换码',
                icon: 'none'
            })
        } else {
            app.FormdataPHP.post('/wxapp/coupon/exchangeReceive', { redeem_code: excNum }, (res) => {
                console.log(res);
                if (res.code == '0000') {
                    wx.showToast({
                        title: '兑换成功',
                    })
                } else {
                    wx.showToast({
                        title: res.message,
                        icon: 'none'
                    })
                }
                _this.setData({
                    excNum: ''
                })
            })
        }
    },
    getBackDetails(e){ 
        let id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '/pages/usCenter/couponInfo/details?id='+id,
        })
    },
    onChange(e){ 
        let index = e.detail.index
        let status = [1,2,3 ];
        this.setData({
            couponList:[],
            status: status[index]
        }, ()=>{
            this.getUserCouponList();
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        if (options.service){
            this.setData({
                service: options.service
            },()=>{
                this.getUserCouponList();
            })
        }
    },
    getUserCouponList(e){
        let parms = {
            status: this.data.status,
            service: this.data.service
        }
        app.FormdataPHP.get('/wxapp/coupon/userCouponList', parms,(res)=>{
            if(res.code == '0000'){
              this.setData({
                  couponList: res.data.coup_list
              })
            }
        })
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