// pages/shopMall/shopList/index.js
let app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        defvalue:'',
        latitude:'',
        longitude:'',
        shopArr:[],
        stationType:'',
        indexNo:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log('shoplist',options)
        if (options.stationType){
            this.setData({
                stationType: options.stationType
            })
        }
         this.getLocation();
        // this.authSet();
        // if (app.globalData.longitude){
        //     this.stationQuery();
        // }else{
            
        // }
    },
    //授权地址
    // authSet(){
    //     let _this = this;
    //     wx.getSetting({
    //         success(res) {
    //             if (!res.authSetting['scope.userLocation']) {
    //                 wx.authorize({
    //                     scope: 'scope.userLocation',
    //                     success() {
    //                         wx.openSetting();
    //                         _this.getLocation();
    //                         // // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
    //                         // wx.startRecord()
    //                     }
    //                 })
    //             }
    //         }
    //     })
    // },
    //搜寻地址
    onSearc(e){
        console.log(e);
        let text = e.detail;
        let arr=[];
        if (text.length>0){
            this.data.shopArr.map((item, index) => {
                if (item.stationName.includes(text)) {
                    arr.push(item)
                }
            })
            this.setData({
                shopArr: arr
            })
        }else{
            this.getLocation();
        }
        // console.log(e.detail)
    },
    //选择店铺
    changShop(e){
        let index = e.currentTarget.dataset.index;
        this.setData({
            indexNo:index
        })
        if (this.data.stationType == 'stationSchool') {
            app.globalData.stationSchool = this.data.shopArr[index]
        } else if (this.data.stationType == 'stationRent') {
            app.globalData.stationRent = this.data.shopArr[index]
        } else if (this.data.stationType == 'stationLaundry') {
            app.globalData.stationLaundry = this.data.shopArr[index]
        } else if (this.data.stationType == 'stationMember'){
            app.globalData.stationMember = this.data.shopArr[index]
        }
        wx.navigateBack({
            delta: 1
        })
    },
    goBack(){
        wx.navigateTo({
            url: '/pages/shopList/map?latitude=' + this.data.latitude + '&' + 'longitude=' + this.data.longitude + '&' + 'stationType=' + this.data.stationType,
        })
    },
    getLocation(){
        let _this = this;
        wx.getLocation({
            type: 'gcj02',
            success(res) {
                _this.setData({
                    latitude: res.latitude,
                    longitude: res.longitude
                },()=>{
                    _this.stationQuery()
                })
            }
        })
    },
    stationQuery(){
        let parms=''
        if (this.data.stationType == 'stationRent'){
            parms= {
                'longitude': this.data.longitude,
                'latitude': this.data.latitude,
                'isRent': 1
            }
        } else if (this.data.stationType == 'stationLaundry'){
            parms = {
                'longitude': this.data.longitude,
                'latitude': this.data.latitude,
                'isWash': 1
            }
        }else{
            parms = {
                'longitude': this.data.longitude,
                'latitude': this.data.latitude
            }
        }
        app.Formdata.get('/openapi/express/wechatapplet/express/station/query',parms,(res)=>{
            if(res.code == '0000') {
                this.setData({
                    shopArr:res.data
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