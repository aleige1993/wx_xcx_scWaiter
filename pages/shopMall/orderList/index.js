// pages/shopMall/orderList/index.js
let app = getApp();
let multiArray = [{
        id: 0,
        text: '今天',
        disabled: false,
        children: [{
                id: 1,
                no: 8,
                disabled: false,
                text: '8:30-9:30'
            },
            {
                id: 2,
                no: 9,
                disabled: false,
                text: '9:30-10:30'
            },
            {
                id: 3,
                no: 10,
                disabled: false,
                text: '10:30-11:30'
            },
            {
                id: 4,
                no: 11,
                disabled: false,
                text: '11:30-12:30'
            },
            {
                id: 5,
                no: 12,
                disabled: false,
                text: '12:30-13:30'
            },
            {
                id: 6,
                no: 13,
                disabled: false,
                text: '13:30-14:30'
            },
            {
                id: 7,
                no: 14,
                disabled: false,
                text: '14:30-15:30'
            },
            {
                id: 8,
                no: 15,
                disabled: false,
                text: '15:30-16:30'
            },
            {
                id: 9,
                no: 16,
                disabled: false,
                text: '16:30-17:30'
            },
            {
                id: 10,
                no: 17,
                disabled: false,
                text: '17:30-18:30'
            },
            {
                id: 11,
                no: 18,
                disabled: false,
                text: '18:30-19:30'
            },
            {
                id: 12,
                no: 19,
                disabled: false,
                text: '19:30-20:30'
            },
            {
                id: 13,
                no: 20,
                disabled: false,
                text: '20:30-21:30'
            }
        ]
    },
    {
        id: 1,
        disabled: false,
        text: '明天',
        children: [{
                id: 1,
                no: 8,
                disabled: false,
                text: '8:30-9:30'
            },
            {
                id: 2,
                no: 9,
                disabled: false,
                text: '9:30-10:30'
            },
            {
                id: 3,
                no: 10,
                disabled: false,
                text: '10:30-11:30'
            },
            {
                id: 4,
                no: 11,
                disabled: false,
                text: '11:30-12:30'
            },
            {
                id: 5,
                no: 12,
                disabled: false,
                text: '12:30-13:30'
            },
            {
                id: 6,
                no: 13,
                disabled: false,
                text: '13:30-14:30'
            },
            {
                id: 7,
                no: 14,
                disabled: false,
                text: '14:30-15:30'
            },
            {
                id: 8,
                no: 15,
                disabled: false,
                text: '15:30-16:30'
            },
            {
                id: 9,
                no: 16,
                disabled: false,
                text: '16:30-17:30'
            },
            {
                id: 10,
                no: 17,
                disabled: false,
                text: '17:30-18:30'
            },
            {
                id: 11,
                no: 18,
                disabled: false,
                text: '18:30-19:30'
            },
            {
                id: 12,
                no: 19,
                disabled: false,
                text: '19:30-20:30'
            },
            {
                id: 13,
                no: 20,
                disabled: false,
                text: '20:30-21:30'
            }
        ]
    }
]

Page({

    /**
     * 页面的初始数据
     */
    data: {
        addresInfo:null,//收货地址
        is_vip:null,//是否为会员
        cart_info:null,//购物车
        store_info:null,//店铺
        indexTab: 0,
        multiArray: multiArray,
        indexArr: [],
        show: false,
        mainActiveIndex: 0,
        activeId: 0,
        textTime:'',
        textName:'',
        isDis:false,
        conpunIshow:false,
        conpunTath:null,
        conpunNum:0,
        conpunIndex:null,
        conpunPice:0,
        usableList:[],
        disableList: [],
        settlement_info:null,
        coup_sn:null,
    },
    //
    changCoupon(e){
        let _this = this; 
        let index = e.currentTarget.dataset.index; 
        let conpunPice = _this.data.usableList[index].discount_fee;
        let coup_sn = _this.data.usableList[index].coup_sn;
        let reduce_info = this.data.usableList[index].reduce_info;
        let total_price =  Number(_this.data.settlement_info.total_price - conpunPice);
        let pay_price = Number(_this.data.settlement_info.pay_price - conpunPice);
        if (_this.data.conpunIndex == index){
            this.setData({
                conpunIndex: null,
                conpunPice: null,
                coup_sn: null,
                reduce_info: '选择优惠券',
                'settlement_info.total_price2':null,
                'settlement_info.pay_price2': null,
                'settlement_info.total_price': Number(_this.data.settlement_info.total_price).toFixed(2),
                'settlement_info.pay_price': Number(_this.data.settlement_info.pay_price).toFixed(2)
            })
        }else {
            this.setData({
                conpunIndex: index,
                conpunPice: conpunPice,
                'settlement_info.total_price2': total_price.toFixed(2),
                'settlement_info.pay_price2': pay_price.toFixed(2),
                coup_sn: coup_sn,
                reduce_info:reduce_info
            }, () => {
                wx.showToast({
                    title: '选择成功！'
                })
            })
        } 
    },
    //获取结算订单 
    getSettlement(e) {
        let _this = this;
        let store_info = this.data.store_info;
        app.FormdataPHP.get('/wxapp/cart/settlementData', { st_id: store_info.st_id }, (res) => {
            if (res.code == '0000') {
                let { coup_list, list } = res.data.settlement_info;
                console.log(coup_list.usable.length)
                this.setData({
                    usableList: coup_list.usable,
                    disableList : coup_list.disable,
                    conpunNum: coup_list.usable.length,
                    settlement_info: res.data.settlement_info
                },() =>{
                    if (coup_list.usable.length>0){
                        let conpunPice = coup_list.usable[0].discount_fee;
                        let coup_sn = coup_list.usable[0].coup_sn;
                        let reduce_info = coup_list.usable[0].reduce_info; 
                        let total_price = Number(_this.data.settlement_info.total_price - conpunPice);
                        let pay_price = Number(_this.data.settlement_info.pay_price - conpunPice);
                        this.setData({
                            conpunIndex: 0,
                            conpunPice: conpunPice,
                            reduce_info: reduce_info,
                            'settlement_info.total_price2': total_price.toFixed(2),
                            'settlement_info.pay_price2': pay_price.toFixed(2),
                            coup_sn: coup_sn
                    }) 
            } 
        })
        }
    })
    },
    //显示优惠券
    topConIshow(){
        this.setData({
            conpunIshow:true
        })
    },
    //隐藏优惠券
    hideConIshow(){
        this.setData({
            conpunIshow: false
        })
    },
    //创建订单
    createOrder(){
        let _this = this;
        wx.showLoading({
            title: '加载中...',
        });
        let _data = this.data;
        let prems = '';
        prems = {
            st_id: _data.store_info.st_id,
            deliver: _data.indexTab == 1 ? '2' : '1',
            addr_id: _data.addresInfo ? _data.addresInfo.id : '',
            give_mode: '2',
            date: _data.dataName,
            coup_sn: _data.coup_sn
        }
        console.log(_data.addresInfo)
        if (_data.indexTab == 1){
            if (_data.addresInfo == '' || _data.addresInfo.id == 'undefined') {
                wx.showToast({
                    title: '请选择配送地址',
                    icon: 'none'
                });
                return false;
            }
            if (_data.textName == ''){
                wx.showToast({
                    title: '请选择配送时间',
                    icon: 'none'
                });
                return false;
            }else{
                prems.time = _data.textName;
            }
        }
        this.setData({
            isDis:true
        })
        
        app.FormdataPHP.post('/wxapp/orders/create',prems,(res)=>{
            if(res.code == '0000') {
                let payWay = res.data.pay;
                wx.requestPayment({
                    timeStamp: payWay.timeStamp,
                    nonceStr: payWay.nonceStr,
                    package: payWay.package,
                    signType: payWay.signType,
                   // signType: 'HMAC-SHA256',
                    paySign: payWay.paySign,
                    success(tis) {
                        wx.showToast({
                            title: '支付成功',
                            icon:'none',
                            success(rult){
                                wx.showLoading({
                                    title: '支付处理中...', 
                                    mask:true
                                })
                                setTimeout(() => {
                                    wx.redirectTo({
                                        url: '/pages/shopMall/orderDetails/index',
                                    })
                                }, 4000)
                            }
                        })
                    },
                    fail(res) {
                        wx.showToast({
                            title: '支付失败',
                            icon: 'none',
                            success(tis) {
                                setTimeout(()=>{
                                    wx.redirectTo({
                                        url: '/pages/shopMall/orderDetails/index',
                                    })
                                },1500)
                            }
                        })
                    }
                })
            } else if (res.data.order) {
                setTimeout(() => {
                    wx.redirectTo({
                        url: '/pages/shopMall/orderDetails/index',
                    })
                }, 1500)
            }else if (res.data.inventory){
                app.Tools.showToast(res.message);
                this.setData({
                    isDis: false
                })
                if (this.data.cart_info.list.length>0){
                    this.data.cart_info.list.map((item, index) => {
                        res.data.inventory.map((intime,inindex)=>{
                            if (intime.barcode == item.barcode){
                                this.data.cart_info.list[index].iscan = false
                            }
                        }) 
                    })
                    this.setData({
                        cart_info: this.data.cart_info
                    })
                }
                
                // wx.switchTab({
                //     url: '/pages/shopMall/index'
                // })
            }else{
                wx.showToast({
                    title: res.message,
                    icon:'none',
                    success(){
                        _this.setData({
                            isDis: false
                        })
                    }
                })
            }
        })
    //    setTimeout(()=>{
    //        wx.hideLoading()
    //        _this.setData({
    //            isDis: false
    //        })
    //    },2000)
    },
    //拨打电话
    makePhoneCall(e) {
        let phone = e.currentTarget.dataset.phone
        wx.makePhoneCall({
            phoneNumber: phone
        })
    },
    onClickNav({
        detail = {}
    }) {
        this.setData({
            mainActiveIndex: detail.index || 0,
            activeId:0,
            textTime:''
        });
    },
    onClickItem({ detail = { } }) { 
        let _this = this;
        console.log(this.data.mainActiveIndex);
        let dataName="";
        if (this.data.mainActiveIndex == 0){
            dataName = app.utils.GetDateStr(0);
        } else if (this.data.mainActiveIndex == 1){
            dataName = app.utils.GetDateStr(1);
        }
        console.log(dataName)
        let mainActiveIndex = this.data.mainActiveIndex == 0 ? '今天':'明天'
        let textName = detail.text;
        this.setData({
            activeId: detail.id,
            textTime: mainActiveIndex +' - '+ textName,
            textName: textName,
            dataName: dataName
        });
        setTimeout(()=>{
            _this.onClose();
        },500)
    },
    onshow() {
        this.getTime();
        this.setData({
            show: true
        });
    },
    onClose() {
        this.setData({
            show: false
        });
    },
    getTime() {
        let myDate = new Date();
        let hour = myDate.getHours();
        let arrList = [];
        console.log(multiArray[0].children)
        multiArray[0].children.map((item, index) => {
            if (item.no > hour) {
                arrList.push(item)
            }
        })
        console.log(arrList)
        this.setData({
            'multiArray[0].children': arrList
        })
    },
    //选择配送方式
    changTab(e) {
        let index = e.target.dataset.index;
        console.log(index);
        this.setData({
            indexTab: index
        })
        // if (this.data.is_vip == 1){
            
        // } else if (index == 1){
        //     wx.showModal({
        //         content: '抱歉您未开通会员，不能使用配送上门',
        //         cancelText:'我知道了',
        //         confirmText:'开通会员',
        //         success(res) {
        //             if (res.confirm) {
        //                wx.navigateTo({
        //                    url: '/pages/memberInfo/openMember/index',
        //                })
        //             } else if (res.cancel) {
        //                 console.log('用户点击取消')
        //             }
        //         }
        //     })
        // }
      
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
                if (res.data.cart_info.length <= 0) {
                    this.clearAll();
                }
                this.setData({
                    cart_info: res.data.cart_info
                })
            }
        })
    },
    goBack(){
        wx.navigateTo({
            url: '/pages/shopMall/addressList/index?store_info=' + JSON.stringify(this.data.store_info),
        })
    },
    //获取收货地址
    getAddresList(){
        app.FormdataPHP.get('/wxapp/address/list', { st_id: this.data.store_info.st_id},(res)=>{
            if (res.code == '0000'){
                    this.setData({
                        addresInfo: res.data.can_use.length>0 ? res.data.can_use[0]:''
                    })
            }
        })
    },
    //获取商品详情
    getGondsDeteil(e){
        let item = e.currentTarget.dataset.items;
        wx.navigateTo({
            url: '/pages/shopMall/goodDetails/index?item=' + JSON.stringify(item) + '&store_info=' + JSON.stringify(this.data.store_info) + '&cart_info=' + JSON.stringify(this.data.cart_info),
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        if (options.prems) {
            let { store_info, cart_info, is_vip } = JSON.parse(options.prems) 
            this.setData({
                store_info,
                cart_info,
                is_vip
            },()=>{
                this.getAddresList();
                this.getSettlement();
            })
         }
    },
   
    //获取时间
    // GetDateStr(index){
    //         var dd = new Date();
    //          dd.setDate(dd.getDate() + index);
    //         var y = dd.getFullYear();
    //         var m = dd.getMonth() + 1;
    //         var d = dd.getDate();
    //         return y + "-" + m + "-" + d;
    // },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
       this.setData({
           isTest: app.UserLogin.get('userInfo').mobile != '13139696803' ? true : false
       })
        if (app.globalData.canUseAddlist){
            this.setData({
                addresInfo:app.globalData.canUseAddlist
            })
        }
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