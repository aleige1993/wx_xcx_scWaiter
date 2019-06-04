
let app =getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        sheetShow:false, 
        shopArr: [],
        shopIndex: '',
        shopItem: '',
        shopArrItem:'',
        mobile:'',
        startTime:'',
        endTime:'',
        newTime: (new Date()).toLocaleDateString().split('/').join('-'),
        iDays:'',
        carInfo:'',
        rechargeMember:'',
        imgArr:'',
        stationRent:'',
        isTest:'',
        coup_list: [],
        conpunIshow: false,
        usableList: [],
        disableList:[],
        conpunNum: 0,
        conpunIndex: null,
        conpunPice: null,
        couponSn: null,
        memberPrice: 0,
        carPrice: 0,
        activeTab:0
    },
    changAction(e){
        let index = e.currentTarget.dataset.index;
        this.setData({
            activeTab:index
        })
    },
    //获取返券
    getWash(e) {
        app.FormdataPHP.get('/wxapp/coupon/shopReceiveList', { service: 2 }, (res) => {
            if (res.code == '0000') {
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
            let memberPrice = Number(_this.data.iDays * _this.data.carInfo.memberPrice).toFixed(2);
            let carPrice = Number(_this.data.iDays * _this.data.carInfo.price).toFixed(2);
            this.setData({
                conpunIndex: null,
                reduce_info: '选择优惠券',
                carPrice: carPrice,
                memberPrice: memberPrice,
                couponSn: null,
                conpunPice: null
            })
        }else{
            let conpunPice = _this.data.usableList[index].discount_fee;
            let couponSn = _this.data.usableList[index].coupon_sn;
            let memberPrice = Number(_this.data.iDays * _this.data.carInfo.memberPrice).toFixed(2) - conpunPice;
            let carPrice = Number(_this.data.iDays * _this.data.carInfo.price).toFixed(2) - conpunPice;
            this.setData({
                conpunIndex: index,
                conpunPice: conpunPice,
                memberPrice: memberPrice.toFixed(2),
                carPrice: carPrice.toFixed(2),
                couponSn: couponSn,
                reduce_info: _this.data.usableList[index].reduce_info,
            },()=>{
                wx.showToast({
                    title: '选择成功！'
                })
            })
        }
        // }
        // this.setData({
        //     conpunIndex: index,
        //     conpunPice: conpunPice,
        //     memberPrice: memberPrice.toFixed(2),
        //     carPrice: carPrice.toFixed(2),
        //     couponSn: couponSn
        // }, () => {
        //     wx.showToast({
        //         title: '选择成功！',
        //         success() {
        //             _this.setData({
        //                 conpunIshow: false,
        //             })
        //         }
        //     })
        // })
    },
    //获取结算订单 
    getSettlement(e) {
        let _this = this;
        if (!this.data.startTime){
            wx.showToast({
                title: '请先选择取车时间',
                icon: 'none',
            })
            return false;
        }
        if (!this.data.endTime) {
            wx.showToast({
                title: '请先选择还车时间',
                icon: 'none',
            })
            return false;
        }
        let parms = {
            carNo: this.data.carInfo.carNo,
            startTime: this.data.startTime,
            endTime: this.data.endTime
        }
        app.Formdata.get('/openapi/express/wechatapplet/express/coupon/canUseListForCar', parms, (res) => {
            console.log(res);
            if (res.code == '0000') {
                let { usable, disable } = res.data;
                this.setData({
                    usableList: usable,
                    disableList: disable,
                    conpunNum: usable.length,
                    conpunIshow: true
                },()=>{
                    if (usable.length > 0) {
                        let conpunPice = usable[0].discount_fee;
                        let couponSn = usable[0].coupon_sn;
                        let memberPrice = Number(_this.data.iDays * _this.data.carInfo.memberPrice) - conpunPice;
                        let carPrice = Number(_this.data.iDays * _this.data.carInfo.price) - conpunPice;
                        this.setData({
                            conpunIndex: 0,
                            conpunPice: conpunPice,
                            reduce_info: usable[0].reduce_info,
                            memberPrice: memberPrice.toFixed(2),
                            carPrice: carPrice.toFixed(2),
                            couponSn: couponSn
                        })
                    } 
                })
            }
        })
    }, 
    //获取日期
    onstartChange(e) {
        this.setData({
            startTime: e.detail.value,
            endTime:''
        },()=>{
            if (this.data.endTime){
                this.getDays();
            }
        })
       
    },
    onendChange(e) {
        if (!this.data.startTime){
            wx.showToast({
                title: '请先选择取车时间',
                icon:'none',
                duration:3000,
                mask:true
            })
            return false
        }
        this.setData({
            endTime: e.detail.value
        },()=>{
            this.getDays();
            let memberPrice =Number(this.data.iDays * this.data.carInfo.memberPrice).toFixed(2);
            let carPrice = Number(this.data.iDays * this.data.carInfo.price).toFixed(2);
            this.setData({
                memberPrice: memberPrice,
                carPrice: carPrice,
            })
        })
    },
    
     getDays(){
        var strSeparator = "-";
        var oDate1;
        var oDate2;
        var iDays;
         oDate1 = this.data.startTime.split(strSeparator);
         oDate2 = this.data.endTime.split(strSeparator);
        var strDateS = new Date(oDate1[0], oDate1[1] - 1, oDate1[2]);
        var strDateE = new Date(oDate2[0], oDate2[1] - 1, oDate2[2]);
        iDays = parseInt(Math.abs(strDateS - strDateE) / 1000 / 60 / 60 / 24);
         console.log('iDays', iDays)
       this.setData({
           iDays: Number(iDays + 1)
       })
    },
    // 选择店铺
    // shoprChange(e) {
    //     this.setData({
    //         'shopIndex': e.detail.value,
    //         'shopItem': this.data.shopArr[e.detail.value].stationNo,
    //         'shopArrItem': this.data.shopArr[e.detail.value]
    //     })
    // },
    //判断是否是会员
    isMember(){
        let userInfo = app.UserLogin.get('userInfo');
        app.Formdata.get('/openapi/express/wechatapplet/express/user/rechargeUserInfo', { userNo: userInfo.userNo }, (res) => {
            if (res.code == "0000" && res.data) {
                this.setData({
                    rechargeMember: res.data.rechargeMember
                })
            }
        })
    },
    //提交
    formSubmit(e) {
        if (this.data.startTime == '') {
            app.Tools.showToast('请选择取车时间');
            return false;
        }
        if (this.data.endTime == '') {
            app.Tools.showToast('请选择还车时间');
            return false;
        }
        if (this.data.stationRent.stationNo == '') {
            app.Tools.showToast('请选择小站');
            return false;
        }
        let parms = {
            carNo: this.data.carInfo.carNo,
            stationNo: this.data.stationRent.stationNo,
            startTime: this.data.startTime,
            endTime: this.data.endTime,
            couponSn: this.data.couponSn
        }
        app.Formdata.post('/openapi/express/wechatapplet/express/car/order/add', parms, (res)=>{
            let _this = this;
            if (res.code == "0000") {
                wx.redirectTo({
                    url: '/pages/laundryOrder/payMent/index?orderno=' + res.data.orderNo + '&payType=3'
                })
            }
        });
    },
    // 获取车辆信息
    getLesCarInfo(){
        app.Formdata.get('/openapi/express/wechatapplet/express/car/query',{},(res) => {
            if(res.code){
                this.setData({
                    carInfo:res.data[0]
                    })
            }
        })
    },
    shoplist(){
        app.Formdata.get('/openapi/express/wechatapplet/express/station/query', {}, (res) => {
            console.log(res);
            if (res.code == '0000') {
                this.setData({
                    shopArr: res.data
                })
            }
        })
    },
    getImgList(position, arr) {
        app.Formdata.get('/openapi/express/wechatapplet/express/advert/queryByPosition', { advPosition: position }, (res) => {
            if (res.code == "0000") {
                this.setData({
                    [arr]: res.data
                })
            }
        })
    },
    //业务说明详情
    goToViewDetails(e) {
        let weburl = "https://cms.songchewang.com/#/index/articleDetail?noaction=true&showall=false&id=110";
            wx.navigateTo({
                url: '/pages/webView/viewInstions?url=' + encodeURIComponent(weburl),
            })
    },

    onLoad: function(options) {
        this.getLesCarInfo();
        // this.shoplist();
        this.isMember();
        this.getImgList('8','imgArr');
        this.getWash();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        console.log(app.globalData.stationRent)
        this.setData({
            isTest: app.UserLogin.get('userInfo').mobile != '13139696803' ? true : false
        })
        if (app.globalData.stationRent) {
            this.setData({
                stationRent: app.globalData.stationRent
            })
        }
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