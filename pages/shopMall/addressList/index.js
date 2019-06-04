// pages/shopMall/addressList/index.js
let app  = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        addressInfo:'',
        store_info:null,
        addressList:null,
        can_use:null,
        forbidden:null,
    },
    //获取默认地址
    getAddressList(){
        app.FormdataPHP.get('/wxapp/address/list',{
            st_id: this.data.store_info.st_id
        },(res) => {
            if(res.code == '0000') { 
                this.setData({
                    can_use: res.data.can_use,
                    forbidden: res.data.forbidden
                })
            }
        })
    },
    //跳转修改地址
    goBact(e){
        let items = e.currentTarget.dataset.items;
        wx.navigateTo({
            url: '/pages/shopMall/addressList/addAddress?state=2&addInfo=' + JSON.stringify(items),
        })
    },
    //删除地址
    delAddre(e){
        let _this = this;
        let items = e.currentTarget.dataset.items;
        wx.showModal({
            content: '确认删除此收货地址吗',
            success(rult) {
                if (rult.confirm) {
                    app.FormdataPHP.post('/wxapp/address/delete', { ids: [items.id] }, (res) => {
                        if (res.code == '0000') {
                            wx.showToast({
                                title: '删除成功',
                                success(){
                                    _this.getAddressList();
                                }
                            })
                        }
                    })
                } else if (rult.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    //提交订单收货地址
    goReturn(e){
        let items = e.currentTarget.dataset.items;
        app.globalData.canUseAddlist = items;
        wx.navigateBack({})
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.store_info){
            this.setData({
                store_info: JSON.parse(options.store_info) 
            },()=>{
                this.getAddressList();
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
        this.getAddressList();
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