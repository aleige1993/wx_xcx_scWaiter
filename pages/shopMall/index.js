
let app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        ca_id: '',//二级ID
        ca_pid:'',//一级ID
        keyword:'',//关键字
        activeOne: 0,//一级高亮
        activeTwo:0,//二级高亮
        cart_info:null,// 购物车
        user_info:null,//会员信息
        is_vip:null,//是否是会员
        store_info:null,//店铺
        goods_list:null,//商品列表
        category_list:null,//商品分类
        category_listTwo:null,//商品二级分类
        search_list:null,//sousuo 
        layer:false,//遮罩
        soso_panl:false,//搜索结果
        shopcart_panl:false,//购物车结果
        active:1,
        boxHeight:'',
        boxWidth:'',
        boxHeightThree:'',
        animation: true,
        hide_good_box: true,
        bus_x:0,
        bus_y: 0,
        latitude: '',//纬度
        longitude:'',//经度
        page_size:10000,
        page:1,
        allList:'',
        isCanscoll:'slideDown',
        isConbox:false, //是否显示优惠券
        conpunList: null,//优惠劵列表
    }, 
    //关闭优惠券
    hideCopbox(e){
        this.setData({
            isConbox:false
        })
    },
    //获取优惠券列表
    getUserCouponList(e){
        let _this = this;
        let prems = {
            service: 1, 
            st_id: _this.data.store_info.st_id
        }
        app.FormdataPHP.post('/wxapp/coupon/list', prems,(res) =>{
            if(res.code == '0000'){
                if (res.data.coup_list.length>0){
                    _this.setData({
                        isConbox: true,
                        conpunList: res.data.coup_list
                    })
                }else{
                    wx.showModal({
                        title: '温馨提示',
                        content: '一大波优惠活动即将发行，请做好准备！',
                        showCancel:false,
                        confirmText:'我知道了'
                    })
                }
            }
        } )
    },
    //点击获取优惠券
    getReceive(e){
        console.log(e);
        let coup_id = e.currentTarget.dataset.id;
        let index = e.currentTarget.dataset.index;
        let _this = this;
        let parms = {
            service: '1',
            st_id: _this.data.store_info.st_id,
            coup_id: coup_id,
        }
        app.FormdataPHP.post('/wxapp/coupon/receive', parms,(res) =>{
            if(res.code == '0000'){
                let key = 'conpunList['+ index +'].status';
                this.setData({
                    [key] :0
                })
                wx.showToast({
                    title: '领券成功!',
                })
                console.log(res);
            }
        } );
    },
    //获取商品详情
    getGondsDeteil(e) {
        let item = e.currentTarget.dataset.items;
        wx.navigateTo({
            url: '/pages/shopMall/goodDetails/index?item=' + JSON.stringify(item) + '&store_info=' + JSON.stringify(this.data.store_info) + '&cart_info=' + JSON.stringify(this.data.cart_info),
        })
    },
    //结算
    goPayFn(){
        let isFalse = true;
        let _this = this;
        if (this.data.cart_info.list.length>0){
            this.data.cart_info.list.map((item)=>{
                if (item.can_buy == false){
                    app.Tools.showToast(`商品：${item.name}库存不足`);
                    isFalse = false
                }
            })
            if (isFalse){

            }else{
                return false;
            }
        }
        let prems = {
            cart_info: _this.data.cart_info,
            store_info: _this.data.store_info,
            is_vip: _this.data.user_info.is_vip
        }
        wx.navigateTo({
            url: "/pages/shopMall/orderList/index?prems=" + JSON.stringify(prems),
            complete(){
                _this.setData({
                    layer: false,
                    shopcart_panl: false,
                    soso_panl: false
                })
            }
        })
    },
    //跳转去地址列表
    getAreess(e){
        let _data = this.data;
        wx.navigateTo({
            url: "/pages/shopMall/shopList/index?latitude=" + _data.latitude + "&longitude=" + _data.longitude
        })
    },
    // 清空
    clearShopCartFn(){
        let _data = this.data;
        let arr=[];
        if (_data.cart_info.list.length>0){
            _data.cart_info.list.map((item) => {
                arr.push(item.barcode);
            })
        }else{
            return false
        }
        let prmes = {
            barcodes: arr,
            st_id: _data.store_info.st_id
        }
        app.FormdataPHP.post('/wxapp/cart/empty',prmes,(res)=>{
            if(res.code == "0000") {
                this.setData({
                    layer: false,
                    shopcart_panl: false,
                    'cart_info.list':[],
                    'cart_info.total_num': '',
                    'cart_info.total_price':0,
                })
            }
        })
    },
    //打开购物车
    showShopCartFn(){
        let _data = this.data;
        if (this.data.cart_info.list.length>0){
            if (_data.shopcart_panl){
                this.setData({
                    layer: false,
                    soso_panl: false,
                    shopcart_panl: false
                })
            }else{
                this.setData({
                    layer: true,
                    shopcart_panl: true,
                    soso_panl: false
                })
            }
        }
       
    },
    //搜索结果
    confirmForm(e){
        let val = e.detail.value;
        let _data = this.data;
        if (val){
            let parms = {
                st_id: _data.store_info.st_id,
                keyword: val,
                page: 1,
                page_size: 10000
            }
            app.FormdataPHP.get('/wxapp/mobile/search',parms,(res)=>{
                if (res.code == '0000') {
                    if (res.data.list.length>0){
                        this.setData({
                            search_list: res.data.list,
                            layer: true,
                             soso_panl:true
                        })
                    }else{
                        wx.showToast({
                            title: '未能查找到相关商品',
                            icon: 'none'
                        })
                    }
                }
            })
        }else{
            wx.showToast({
                title: '请输入商品名',
                icon:'none'
            })
        }
        
    },
    //关闭弹窗
    clearAll(){
        this.setData({
            layer: false,
            soso_panl: false,
            shopcart_panl:false
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    //获取所有数据
    getHomepage(){
        wx.showLoading({
            title: '数据加载中...',
        })
        let  _this = this;
        let prmes = {
            latitude: _this.data.latitude, 
            longitude: _this.data.longitude, 
            page_size: _this.data.page_size, 
            page: _this.data.page, 
            st_id: _this.data.store_info ? _this.data.store_info.st_id:''
        }
        app.FormdataPHP.get('/wxapp/mobile/homepage', prmes , (res) => {
            if(res.code == '0000'){
                let { cart_info, category_list, goods_list, store_info, user_info } = res.data;
                // if (category_list.length<=0) {
                //     wx.showModal({
                //         title: '温馨提示',
                //         content: '此商铺还在装修，我们去首页看看吧',
                //         showCancel:false,
                //         confirmText:'我去看看',
                //         success(res) {
                //             if (res.confirm) {
                //                 wx.switchTab({
                //                     url: '/pages/index/index'
                //                 })
                //             } 
                //         }
                //     })
                //     return false
                // }
                if (Object.keys(category_list).length <= 0) {
                    _this.setData({
                        user_info: user_info,
                        cart_info,
                        category_list,
                        goods_list,
                        store_info,
                        category_listTwo:[]
                    })
                }else{
                    let one = Object.keys(category_list[0])[0];
                    let two = category_list[one][0].id;
                    let category_listTwo = Object.keys(category_list).length > 0 ? category_list[two] : []
                    _this.setData({
                        user_info: user_info,
                        cart_info,
                        category_list,
                        goods_list,
                        store_info,
                        activeOne: one,
                        ca_pid: two,
                       ca_id: category_list[two][0].id,
                        category_listTwo: category_listTwo
                    })
                }
                app.UserLogin.set('storeInfo', store_info);
                app.UserLogin.set('vipInfo', user_info);
            }
            wx.hideLoading();
        })
    },
    //第一级
    hdChangeOne({ currentTarget = {} }){
        let { indone, idone  } = currentTarget.dataset;
        this.setData({
            activeOne: indone,
            activeTwo:0,
            ca_pid: idone,
            ca_id:0,
            category_listTwo: this.data.category_list[idone]
        },()=>{
            this.serachGods();
        })
    },
     //第二级
    hdChangeTwo({ currentTarget = {} }) {
        let { indtwo, idtwo} = currentTarget.dataset;
        this.setData({
            activeTwo: indtwo,
            ca_id: idtwo
        }, () => {
            this.serachGods();
        })
    },
//点击商品添加购物车
    addGoods(e){
        let item = e.currentTarget.dataset.item;
        let operate = e.currentTarget.dataset.operate;
        let parms = {
            barcode: item.barcode,
            num: '1',
            operate: operate,
            st_id: this.data.store_info.st_id
        }
        app.FormdataPHP.post('/wxapp/cart/modifyCartNum',parms,(res)=>{
            if(res.code == '0000') {
                if (res.data.cart_info.list.length <= 0) {
                         this.clearAll();
                    }
                    this.setData({
                        cart_info: res.data.cart_info
                    })
            }
        })
    },
//获取购物车信息
getCartList(){
    if (this.data.store_info){
        app.FormdataPHP.get('/wxapp/cart/list', { st_id: this.data.store_info.st_id }, (res) => {
            if (res.code == '0000') {
                if (res.data.cart_info.list.length <= 0) {
                    this.clearAll();
                }
                this.setData({
                    cart_info: res.data.cart_info,
                    user_info: res.data.user_info
                })
            }
        });
   }
},
//筛选商品
serachGods(e){
    var sendDate = (new Date()).getTime();
    var receiveDate = '';
    var responseTimeMs = '';
    let _this = this;
    let _data = this.data;
    let parms = {
        st_id: _data.store_info.st_id,
        ca_pid: _data.ca_pid,
        ca_id: _data.ca_id,
        keyword: _data.keyword,
        page:1,
        page_size:10000
    }
    app.FormdataPHP.get('/wxapp/mobile/search', parms,(res)=>{
        if(res.code == '0000'){
             receiveDate = (new Date()).getTime();
            this.setData({
                goods_list: res.data.list
            })
            responseTimeMs = receiveDate - sendDate;
        }
    })
},
    onLoad: function (options) {
       let _this = this;
        if (options){
            let station = JSON.parse(options.station);
            _this.setData({
                store_info: station
            },()=>{
                _this.getLocation();
            })
        }  
        wx.getSetting({
            success: (res) => {
                if (!res.authSetting['scope.userLocation'])
                    _this.openConfirm()
            }
        })
        this.busPos = {};
        this.busPos['x'] = 20;
        this.busPos['y'] = 600 - 56;

        let res = wx.getSystemInfoSync();
        let boxHeight = res.windowHeight -200;
        let boxHeightTwo= res.windowHeight - 240;
        let boxHeightThree = res.windowHeight - 160;
        let boxHeightCan = res.windowHeight - 120;
        let boxHeightTwoCan = res.windowHeight - 160;
        let boxWidth = res.windowWidth - 100;
        this.setData({
            'boxHeight': boxHeight,
            'boxWidth': boxWidth,
            'boxHeightTwo': boxHeightTwo,
            'boxHeightThree':boxHeightThree,
            'boxHeightCan': boxHeightCan,
            'boxHeightTwoCan': boxHeightTwoCan
        });

    },
    //获取定位
    getLocation(e){
        let _this = this;
        if (app.globalData.latitude && app.globalData.longitude){
            _this.setData({
                latitude: app.globalData.latitude,
                longitude: app.globalData.longitude
            }, () => {
                _this.getHomepage();
            })
        }else{
            wx.showLoading({
                title: '定位中...',
            })
            wx.getLocation({
                type: 'gcj02',
                altitude: true,
                success: function (res) {
                    app.globalData.latitude = res.latitude;
                    app.globalData.longitude = res.longitude;
                    _this.setData({
                        latitude: res.latitude,
                        longitude: res.longitude
                    }, () => {
                        _this.getHomepage();
                    })
                },
                fail: function (err) {
                    wx.showToast({
                        title: '获取失败',
                        icon: 'none'
                    })
                },
                complete: function () {
                    wx.hideLoading()
                }
            })
        }
    },
    openConfirm(){
        let _this = this;
        wx.showModal({
            content: '检测到您没打开定位权限，是否去设置打开？',
            confirmText: "确认",
            cancelText: "取消",
            success: function (res) {
                if (res.confirm) {
                    wx.openSetting({
                        success: (res) => { 
                            _this.getLocation();
                        }
                    })
                } else {
                    console.log('用户点击取消')
                }
            }
        });
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
        this.setData({
            isTest: app.UserLogin.get('userInfo').mobile == '13139696803' ? false : true
        })
        this.getCartList();
        if (this.data.user_info){
            if (this.data.user_info.is_vip == app.UserLogin.get('vipInfo').is_vip) {
            } else { 
                this.getHomepage();
            }
        } 
        if (app.globalData.stationMall){
            if (app.globalData.stationMall.st_id == app.UserLogin.get('storeInfo').st_id){
            }else{
                this.setData({
                    store_info: app.globalData.stationMall
                })
                app.UserLogin.set('storeInfo', app.globalData.stationMall); 
                this.getHomepage();
            }
        }else{
            if (this.data.store_info){
                if (this.data.store_info.st_id == app.UserLogin.get('storeInfo').st_id){
                }else{ 
                    this.getHomepage();
                }
            }else{ 
                this.getHomepage();
            }
        }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },
    touchStart(e){
        app.utils.touchStart(e);
    },
    touchMove(e){
        console.log('touchMove',e)
        app.utils.touchMove(e);
    },
    touchEnd(e){
        let istext = app.utils.touchEnd(e);
        console.log(istext)
        if (istext == 'top'){
            this.setData({
                isCanscoll:'slideUp'
            })
        } else if (istext == 'down'){
            this.setData({
                isCanscoll: 'slideDown',

            }) 
        }
    }, 
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },
    onPageScroll:function(e){

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

    },
   
    touchOnGoods: function (e) {
        this.finger = {}; var topPoint = {};
        this.finger['x'] = e.touches["0"].clientX;//点击的位置
        this.finger['y'] = e.touches["0"].clientY;

        if (this.finger['y'] < this.busPos['y']) {
            topPoint['y'] = this.finger['y'] - 150;
        } else {
            topPoint['y'] = this.busPos['y'] - 150;
        }
        topPoint['x'] = Math.abs(this.finger['x'] - this.busPos['x']) / 2;

        if (this.finger['x'] > this.busPos['x']) {
            topPoint['x'] = (this.finger['x'] - this.busPos['x']) / 2 + this.busPos['x'];
        } else {//
            topPoint['x'] = (this.busPos['x'] - this.finger['x']) / 2 + this.finger['x'];
        }

        this.linePos = app.Bezier.bezier([this.busPos, topPoint, this.finger], 60);
        this.startAnimation(e);
        this.addGoods(e);
    },
    startAnimation: function (e) {
        var index = 0, that = this,
            bezier_points = that.linePos['bezier_points'];

        this.setData({
            hide_good_box: false,
            bus_x: that.finger['x'],
            bus_y: that.finger['y']
        })
        var len = bezier_points.length;
        index = len
        this.timer = setInterval(function () {
            for (let i = index - 1; i > -1; i--) {
                that.setData({
                    bus_x: bezier_points[i]['x'],
                    bus_y: bezier_points[i]['y']
                })

                if (i < 1) {
                    clearInterval(that.timer);
                    that.setData({
                        hide_good_box: true
                    })
                }
            }
        }, 10);
    }
})

// {
//     "pagePath": "pages/shopMall/index",
//         "text": "超市",
//             "selectedIconPath": "/static/images/shop_b.png",
//                 "iconPath": "/static/images/shop_a.png"
// },