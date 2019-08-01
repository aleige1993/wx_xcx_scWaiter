// pages/shopMall/goodDetails/index.js
let app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        st_id: null,
        barcode: null,
        types: null,
        html: '<div>我是详情信息</div>',//富文本
        layer: false,//遮罩
        shopcart_panl: false,//购物车结果
        store_info: null,//店铺
        goods_list: null,//商品列表
        cart_info: null,//购物车
        goods_info: null,//商品详情
        user_info: null,//是否为会员
        aaa: ''
    },
    //拨打电话
    makePhoneCall(e) {
        let phone = e.currentTarget.dataset.phone
        wx.makePhoneCall({
            phoneNumber: phone
        })
    },
    getGondsDeteil(e) {
        let item = e.currentTarget.dataset.items;
        wx.navigateTo({
            url: '/pages/shopMall/goodDetails/index?item=' + JSON.stringify(item) + '&store_info=' + JSON.stringify(this.data.store_info) + '&cart_info=' + JSON.stringify(this.data.cart_info),
        })
    },
    // 清空
    clearShopCartFn() {
        let _data = this.data;
        let arr = [];
        if (_data.cart_info.list.length > 0) {
            _data.cart_info.list.map((item) => {
                arr.push(item.barcode);
            })
        } else {
            return false
        }
        let prmes = {
            barcodes: arr,
            st_id: _data.store_info.st_id
        }
        app.FormdataPHP.post('/wxapp/cart/empty', prmes, (res) => {
            if (res.code == "0000") {
                this.setData({
                    layer: false,
                    shopcart_panl: false,
                    'cart_info.list': [],
                    'cart_info.total_num': '',
                    'cart_info.total_price': 0,
                })
            }
        })
    },
    //点击商品添加购物车
    addGoods(e) {
        let item = e.currentTarget.dataset.item;
        let operate = e.currentTarget.dataset.operate;
        let parms = {
            barcode: item.barcode,
            num: '1',
            operate: operate,
            st_id: this.data.store_info.st_id
        }
        app.FormdataPHP.post('/wxapp/cart/modifyCartNum', parms, (res) => {
            if (res.code == '0000') {
                if (res.data.cart_info.list.length <= 0) {
                    this.clearAll();
                }
                this.setData({
                    cart_info: res.data.cart_info
                })
            }
        })
    },
    //结算
    goPayFn() {
        let isFalse = true;
        if (this.data.cart_info.list.length > 0) {
            this.data.cart_info.list.map((item) => {
                if (item.can_buy == false) {
                    console.log(item.can_buy)
                    app.Tools.showToast(`商品：${item.name}库存不足`);
                    isFalse = false
                }
            })
            if (isFalse) {

            } else {
                return false;
            }
        }
        let prems = {
            cart_info: this.data.cart_info,
            store_info: this.data.store_info,
            is_vip: this.data.user_info.is_vip
        }
        wx.navigateTo({
            url: "/pages/shopMall/orderList/index?prems=" + JSON.stringify(prems)
        })
    },
    //打开购物车
    showShopCartFn() {
        let _data = this.data;
        if (_data.cart_info.list.length > 0) {
            if (_data.shopcart_panl) {
                this.setData({
                    layer: false,
                    soso_panl: false,
                    shopcart_panl: false
                })
            } else {
                this.setData({
                    layer: true,
                    shopcart_panl: true,
                    soso_panl: false
                })
            }
        }
        // this.setData({
        //     layer: true,
        //     shopcart_panl: true,
        //     soso_panl: false
        // })
    },
    //关闭弹窗
    clearAll() {
        this.setData({
            layer: false,
            soso_panl: false,
            shopcart_panl: false,
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    //获取商品
    getGoodsInfo() {
        let parms = "";
        wx.showLoading({
            title: '加载中...',
        })
        if (this.data.types == 1) {
            parms = {
                st_id: this.data.st_id,
                barcode: this.data.barcode
            }
        } else {
            parms = {
                st_id: this.data.store_info.st_id,
                barcode: this.data.goods_list.barcode
            }
        }
        app.FormdataPHP.get('/wxapp/mobile/goodsInfo', parms, (res) => {
            if (res.code == '0000') {
                this.setData({
                    goods_info: res.data.goods_info,
                    user_info: res.data.user_info,
                    store_info: res.data.store_info
                })
                wx.hideLoading();
            } else {
                wx.hideLoading();
            }
        })
    },
    onLoad: function (options) {
        console.log('goodDetails', options)
        if (options) {
            if (options.types == 1) {
                this.setData({
                    types: 1,
                    st_id: options.stid,
                    barcode: options.barcode
                }, () => {
                    this.getGoodsInfo();
                })
            } else {
                this.setData({
                    cart_info: JSON.parse(options.cart_info),
                    goods_list: JSON.parse(options.item),
                    store_info: JSON.parse(options.store_info)
                }, () => {
                    this.getGoodsInfo();
                })
            }
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