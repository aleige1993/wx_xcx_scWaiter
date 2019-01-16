// pages/ schoolCar/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        shopArr: ['店铺1', '店铺2', '店铺3', '店铺4'],
        shopIndex:'',
        carArr: ['A1', 'A2', 'B1', 'C1'],
        carIndex: '',
        sexIndex:'',
        sexArr:['男','女']
    },
    // 选择店铺
    shoprChange(e){
        this.setData({
            shopIndex: e.detail.value
        })
    },
    carChange(){
        this.setData({
            carIndex: e.detail.value
        })
    },
    sexChange(e){
        this.setData({
            sexIndex: e.detail.value
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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