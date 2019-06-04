// pages/laundryOrder/index.js
import Toast from '../../../ui-plugins/vant/toast/toast';
let app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        scrollHeight: 0,
        scrollTop: 0,
        page: 1,
        limit: 15,
        status: '1',
        listItme: [],
        statusArr:['1','2','3','4','5']//订单状态
    },
    getIndex(e) {
        let index = e.detail.index
        this.setData({
            page: 1,
            listItme: [],
            scrollTop: 0,
            status:this.data.statusArr[index]
        })
        this.getOrder();
    },
    // bindtop(e) {
    //    this.setData({
    //        page:1,
    //        listItme:[]
    //    })
    //    this.getOrder();
    // },
    editStatus(e){
        let _this = this;
        let orderno = e.target.dataset.orderno;
        wx.showModal({
            title: '温馨提示',
            content:'取消退货申请',
            success(res) {
                if (res.confirm) {
                    app.FormdataPHP.post('/wxapp/orders/cancelRefund', { 'cancel_no': orderno}, (res) => {
                        console.log(res)
                        if (res.code == '0000') {
                            wx.showToast({
                                title: '取消成功',
                            })
                            _this.setData({
                                page: 1,
                                listItme: []
                            })
                            _this.getOrder();
                        }
                    })
                } else if (res.cancel) {
                   
                }
            }
        })
    },
    clickQuestion(e){
        let mobile = e.currentTarget.dataset.mobile;
        if (!mobile){
            return false
        }
        wx.showModal({
            title: '客服电话',
            content: mobile,
            confirmText:'拨打',
            success(res) {
                if (res.confirm) {
                    wx.makePhoneCall({
                        phoneNumber: mobile
                    })
                } else if (res.cancel) {
                }
            }
        })
    },
    delOrder(e) {
        let _this = this;
        let orderno = e.target.dataset.orderno;
        wx.showModal({
            title: '温馨提示',
            content: '确认取消退货？',
            success(res) {
                if (res.confirm) {
                    app.FormdataPHP.post('/wxapp/orders/cancelRefund', { 'order_no': orderno} ,(data) => {
                        if (data.code=='0000'){
                            wx.showToast({
                                title: '取消成功',
                            })
                            _this.setData({
                                page:1,
                                listItme:[]
                            })
                            _this.getOrder();
                        }
                    })
                } else if (res.cancel) {
                }
            }
        })
    },
    golaundryOrder(e) {
        wx.redirectTo({
            url: '/pages/shopMall/index'
        })
    },
    goOrderDetails(e) {
        console.log(e)
        let orderno = e.currentTarget.dataset.orderno;
        wx.navigateTo({
            url: '/pages/shopMall/returnOrder/details?orderno=' + orderno
        })
    },
    goOrderPeyMent(e) {
        // let orderno = e.target.dataset.orderno;
        // wx.navigateTo({
        //     url: '/pages/laundryOrder/payMent/index?orderno=' + orderno + '&payType=1'
        // })
    },
    binddown(e) {
        this.setData({
            page: ++this.data.page
        })
        this.getOrder();
    },
    //根据状态值 获取数据
    getOrder() {
        wx.showLoading({
            title: '加载中...',
        })
        let query = {
            page: this.data.page,
            limit: this.data.limit,
            type: this.data.status
        }
        app.FormdataPHP.get('/wxapp/orders/refundOrdersList', query, (res) => {
            console.log(res);
            if (res.code == "0000") {
                this.setData({
                    listItme: this.data.listItme.concat(res.data.data)
                })
            }
            setTimeout(()=>{
               wx.hideLoading()
            },2000)
            if(res.data.data.length<=0){
                wx.showToast({
                    title: '没有更多数据',
                    icon: 'none',
                    duration: 2000
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
       // this.getOrder();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        let _this = this;
        wx.getSystemInfo({
            success: function(res) {
                _this.setData({
                    scrollHeight: res.windowHeight - 44 + 'px'
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        this.setData({
            listItme:[],
            page:1
        })
        this.getOrder();
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

    },
    onPageScroll(event) {
        this.setData({
            scrollTop: event.scrollTop
        });
    }
})