// pages/shopMall/shopList/index.js
let app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        defvalue:'',
        store_list:[],
        latitude:null,
        longitude:null
    },
    changShop(e) {
        let index = e.currentTarget.dataset.index;
        let item = this.data.store_list[index];
        app.globalData.stationMall = item;
        wx.navigateBack({
            delta: 1
        })
    },
    onSearc(e) {
        console.log(e);
        let text = e.detail;
        let arr = [];
        if (text.length > 0) {
            this.data.store_list.map((item, index) => {
                if (item.st_name.includes(text)) {
                    arr.push(item)
                }
            })
            this.setData({
                store_list: arr
            })
        } else {
            this.getShoolist(this.data.latitude, this.data.longitude);
        }
    },
    goBack() {
        wx.navigateTo({
            url: '/pages/shopMall/shopList/map?latitude=' + this.data.latitude + '&' + 'longitude=' + this.data.longitude,
        })
    },
    getShoolist(latitude, longitude){
        app.FormdataPHP.get('/wxapp/mobile/storeList', { latitude, longitude},(res)=>{
            if(res.code == '0000') {
               this.setData({
                   store_list: res.data.store_list
               })
            }
        })

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        if (options.latitude){
            this.setData({
                latitude: options.latitude,
                longitude: options.longitude
            })
            this.getShoolist(options.latitude, options.longitude);
        }else{
          wx.showModal({
              title: '温馨提示',
              content: '未能获取到你的位置信息',
              showCancel:false,
              confirmText:'我知道了',
              success:(res)=>{
                  if(res.confirm){
                      wx.navigateBack({
                          delta: 1
                      })
                  }
              }
          })
        }
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