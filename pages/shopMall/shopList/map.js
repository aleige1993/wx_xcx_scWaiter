// pages/shopList/map.js
let app = getApp();
// let QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');

// let qqmapsdk;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        ww:'',
        hh:'',
        latitude:'',//纬度
        longitude:'',//经度
        markers:[], //标注地址
        dataList:null,
        stationType:'',
        notification:true
    },
    onLoad: function (options) {
        let  _this = this;
        _this.setData({
            ww: app.globalData.ww,
            hh: app.globalData.hh
        })
         _this.getLocation();
    },
    callLocation(e){
        let stoping='';
        let id = e.markerId || 0;
       this.data.dataList.map((item,index)=>{
           if (item.st_id == id){
                stoping = item
            }
        })
        app.globalData.stationMall = stoping
        wx.navigateBack({
            delta: 2
        })
    },
    getLocation() {
        let _this = this;
        //获取当前地址
        wx.getLocation({
            type: 'gcj02',
            success(res) {
                _this.setData({
                    latitude: res.latitude,
                    longitude: res.longitude
                },(data)=>{
                    _this.getShopList(res.longitude, res.latitude);
                })
            }
        })
    },
    //获取中心经纬度
    getCenterLocation(e) {
        let  _this = this;
        if (e.type == 'end') {
             _this.setData({
                notification:false
            })
            this.mapCtx.getCenterLocation({
                success(res){
                    _this.getShopList(res.longitude, res.latitude);
                    _this.setData({
                        notification: true
                    })
                }
            })
        }
    },
    //通过经纬度获取列表
    getShopList(longitude, latitude){
        let parms =  {
                'longitude': longitude,
                'latitude': latitude
            }
        app.FormdataPHP.get('/wxapp/mobile/storeList', parms, (res) => {
            let mark=[];
            if(res.code == '0000') {
                if (res.data.store_list.length>0) {
                        res.data.store_list.map((item,index)=>{
                            mark.push({
                                id: item.st_id,
                                latitude: item.latitude,
                                longitude: item.longitude,
                                iconPath:'../../../static/images/shopbut.png',
                                width:30,
                                height:30,
                                callout:{
                                    content: '点击选择：' + item.st_name + '-' + item.distance,
                                    padding:5,
                                    borderRadius:8,
                                    borderWidth:2,
                                    fontSize:12,
                                    borderColor:'#ff6699',
                                    color:'#ff6699',
                                    bgColor:'#FFFAF0'
                                }
                            })
                        })
                       this.setData({
                           markers:mark,
                           dataList: res.data.store_list
                       }) 
                    }else{
                        this.setData({
                            markers: [],
                            dataList: []
                        }) 
                    }
            }
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.mapCtx = wx.createMapContext('map')
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