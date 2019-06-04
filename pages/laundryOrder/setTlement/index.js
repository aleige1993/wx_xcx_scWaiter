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
        ids:[],
        stationLaundry:'',
        coup_list:[],
        conpunIshow:false,
        usableList: [],
        conpunNum:0,
        conpunIndex: null,
        conpunPice: null,
        couponSn:null,
        disableList:[],
        reduce_info:null,
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
    // getAdderquery() {
    //     app.Formdata.get('/openapi/express/wechatapplet/express/station/query',{},(res) =>{
    //         this.setData({
    //             shopArr:res.data
    //         })
    //     })
    // },
    orderAdd() {
        if (!this.data.stationLaundry){
            wx.showToast({
                title: '请选择小站',
                icon:'none'
            })
            return false
        }
        let parman = {
            memo: this.data.val,
            ids: this.data.ids,
            stationNo: this.data.stationLaundry.stationNo,
            couponSn: this.data.couponSn
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
        // this.getAdderquery();
        app.Formdata.get('/openapi/express/wechatapplet/express/wash/order/showPre', { ids: ids},(res)=>{
            console.log(res)
            if(res.code=="0000") {
                if(res.data){
                    res.data.allDiscount = (Number(res.data.discounts ? res.data.discounts:0) + Number(res.data.inActDiscount ? res.data.inActDiscount:0)).toFixed(2) ;
                }
                this.setData({
                    listItme:res.data,
                    ids: ids
                },()=>{
                    this.getSettlement();
                })
            }
        });
        wx.hideLoading();
        this.getWash();
    },
    //获取返券
    getWash(e){
        app.FormdataPHP.get('/wxapp/coupon/shopReceiveList', { service:3},(res)=>{
            if(res.code == '0000'){
                console.log(res)
                this.setData({
                    coup_list: res.data.coup_list
                })
            }
        })
    },
    //显示优惠券
    topConIshow() {
        this.setData({
            conpunIshow: true
        })
    },
    //隐藏优惠券
    hideConIshow() {
        this.setData({
            conpunIshow: false
        })
    },
    changCoupon(e) {
        let _this = this;
        let index = e.currentTarget.dataset.index; 
        if (_this.data.conpunIndex == index){ 
            this.setData({
                conpunIndex:null,
                reduce_info: '选择优惠券',
                'listItme.allDiscount':null,
                'listItme.paymentAmount2': null,
                couponSn: null,
                conpunPice: null
            })
        }else{
            let conpunPice = _this.data.usableList[index].discount_fee;
            let paymentAmount = Number(_this.data.listItme.totalAmount - conpunPice - _this.data.listItme.discounts);
            let allDiscount = Number(conpunPice) + Number(_this.data.listItme.discounts);
            let couponSn = _this.data.usableList[index].coupon_sn; 
            this.setData({
                conpunIndex: index,
                conpunPice: conpunPice,
                reduce_info: _this.data.usableList[index].reduce_info,
                'listItme.allDiscount': allDiscount.toFixed(2),
                'listItme.paymentAmount2': paymentAmount.toFixed(2),
                couponSn: couponSn
            })
        }
    },
    //获取结算订单 
    getSettlement(e) {
        let _this = this;
        app.Formdata.get('/openapi/express/wechatapplet/express/coupon/canUseListForWash', { ids: this.data.ids}, (res) => {
           console.log(res);
            if (res.code == '0000') {
                let { usable, disable } = res.data; 
                this.setData({
                    usableList: usable,
                    disableList: disable,
                    conpunNum: usable.length
                },()=>{
                    if (usable.length>0){
                        let conpunPice = _this.data.usableList[0].discount_fee;
                        let paymentAmount = Number(_this.data.listItme.totalAmount - conpunPice - _this.data.listItme.discounts);
                        let allDiscount = Number(conpunPice) + Number(_this.data.listItme.discounts);
                        let couponSn = _this.data.usableList[0].coupon_sn; 
                        this.setData({
                            conpunIndex: 0,
                            conpunPice: conpunPice,
                            reduce_info: _this.data.usableList[0].reduce_info,
                            'listItme.allDiscount': allDiscount.toFixed(2),
                            'listItme.paymentAmount2': paymentAmount.toFixed(2),
                            couponSn: couponSn
                        })
                    }
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
        console.log('stationLaundry',app.globalData.stationLaundry)
        if (app.globalData.stationLaundry) {
            this.setData({
                stationLaundry: app.globalData.stationLaundry
            })
        }
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