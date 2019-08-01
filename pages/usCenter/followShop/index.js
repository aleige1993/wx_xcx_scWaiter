// pages/usCenter/followShop/index.js
let app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        storeList: [],
        page:1,
        pageSize:1000,
        nodata:false
    }, 
    //获取关注小站
    getStoreList(){
        let _this = this;
        let parms = {
            page: _this.data.page,
            page_size: _this.data.pageSize
        }
        app.FormdataNewPHP.get('/user.attention/attentionList', parms ,(res)=>{
            if(res.code == '0000'){
                console.log(res); 
                this.setData({
                    storeList: res.data.attention_list
                })
                if (res.data.attention_list.length <= 0){
                    this.setData({
                        nodata: true
                    })
                }
            }
        })
    },
    goToshop(e) {
        let data = e.currentTarget.dataset.station;
        wx.navigateTo({
            url: '/pages/shopMall/index?station=' + JSON.stringify(data),
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
       
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
        this.getStoreList();
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