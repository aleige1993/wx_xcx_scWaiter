
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
        imgArr:''
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
    shoprChange(e) {
        this.setData({
            'shopIndex': e.detail.value,
            'shopItem': this.data.shopArr[e.detail.value].stationNo,
            'shopArrItem': this.data.shopArr[e.detail.value]
        })
    },
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
        console.log(this.data.shopArrItem)
        if (this.data.startTime == '') {
            app.Tools.showToast('请选择取车时间');
            return false;
        }
        if (this.data.endTime == '') {
            app.Tools.showToast('请选择还车时间');
            return false;
        }
        if (this.data.shopArrItem == '') {
            app.Tools.showToast('请选择小站');
            return false;
        }
        let parms = {
            carNo: this.data.carInfo.carNo,
            stationNo: this.data.shopArrItem.stationNo,
            startTime: this.data.startTime,
            endTime: this.data.endTime
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
        this.shoplist();
        this.isMember();
        this.getImgList('8','imgArr');
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