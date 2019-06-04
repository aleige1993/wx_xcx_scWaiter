//index.js
//获取应用实例
const app = getApp()
Page({
    data: {
        store_list:[],
        mainActiveIndex: 0,
        multiArray: [],
        show: false,
        codeInfo: '',
        stationNo: '',
        isLogin: false,
        isShow: false,
        isConpun: false,
        state: 1,
        banner: {
            bannerArr: [],
            openmenber: [],
            indicatorDots: true,
            autoplay: true,
            interval: 5000,
            intervaltwo: 8000,
            duration: 1000
        },
        sreachForm: {
            page: 1,
            limit: 1000,
            status: 1,
            expressNo: ''
        },
        expressList: [],
        openmenber: [],
        rechargeMember: '',
        rechargeUserInfo: '',
        codeInfo: '', //wx.login
        isTest: false,
        itemPrame: {
            items: '',
            index: ''
        },
        isReceive:false,
        recCoupon:[],
        recIndex:null,
        regisCoupList:[]
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
        multiArray[0].children.map((item, index) => {
            if (item.no > hour) {
                arrList.push(item)
            }
        })
        this.setData({
            'multiArray[0].children': arrList
        })
    },
    //跳转banner详情
    goToViewDetails(e) {
        if (e.currentTarget.dataset.name == '会员权益') {
            this.getIFmenber();
        } else if (e.currentTarget.dataset.url) {
            let weburl = e.currentTarget.dataset.url;
            wx.navigateTo({
                url: '/pages/webView/viewInstions?url=' + encodeURIComponent(weburl),
            })
        }
    },
    onGotUserInfo(e) {
        let wxUserInfo = e.detail.userInfo
        if (wxUserInfo) {
            app.UserLogin.set('wxUserInfo', wxUserInfo);
            this.setData({
                state: 2
            })
        }
    },

    onGetphonenum(e) {
        let _this = this;
        if (_this.data.codeInfo.code) {
            app.Formdata.post('/openapi/common/user/login', {
                "wxCode": _this.data.codeInfo.code,
                "wxEncData": e.detail.encryptedData,
                "wxIv": e.detail.iv,
                "code": "5",
                "password": "123456",
                "account": "account",
                "stationNo": _this.data.stationNo ? _this.data.stationNo : ''
            }, (res) => {
                app.UserLogin.set('userInfo', res.data);
                if (res.success && res.success === 'true') {
                    _this.setData({
                        isShow: false,
                        isLogin: true,
                        isTest: res.data.mobile == '13139696803' ? false : true
                    }, () => {
                        wx.showToast({
                            title: '登录成功',
                            success() {
                                if (_this.data.isLogin) {
                                    _this.getLocation();
                                    _this.getMernber();
                                    _this.getReceive();
                                    _this.getImgList();
                                    _this.getNearbyStore();
                                }
                            }
                        })
                    })
                } else {
                    app.Tools.showToast(res.message);
                }
            })
        } else {
            wx.showToast({
                title: '获取code信息失败',
                icon: 'none'
            })
        }
    },
    onShow: function() {
        let _this = this;
        if (!app.UserLogin.get('wxUserInfo')) {
            this.setData({
                isShow: true,
                state: 1
            })
        } else if (!app.UserLogin.get('userInfo')) {
            this.setData({
                isShow: true,
                state: 2
            })
        } else {
            this.setData({
                isShow: !app.UserLogin.get('wxUserInfo'),
                isLogin: app.UserLogin.get('userInfo'),
                isTest: app.UserLogin.get('userInfo').mobile != '13139696803' ? true : false
            })
        }  
            if (app.globalData.employId && app.globalData.employId != '') {
                _this.getImgList();
                _this.getNearbyStore();
            } else {
                app.employIdCallback = employId => {
                    if (employId != '') {
                        _this.getImgList();
                        _this.getNearbyStore(); 
                    }
                }
            } 
    },
    onHide: function() {},
    getImgList() {
        let _this = this; 
            app.Formdata.get('/openapi/express/wechatapplet/express/advert/queryByPosition', {
                advPosition: '0'
            }, (res) => {
                if (res.code == "0000") {
                    var arr = [
                        ['1', 'banner.bannerArr'],
                        ['7', 'banner.openmenber'],
                        ['10', 'rightcar'],
                        ['11', 'leftwash']
                    ];
                    if (res.data) {
                        let data = res.data;
                        arr.map((item, index) => {
                            let moveArr = []
                            data.map((daitem, daindex) => {
                                if (item[0] == daitem.advPosition) {
                                    moveArr.push(daitem);
                                }
                            })
                            _this.setData({
                                [item[1]]: moveArr
                            })
                        })
                    }
                }
            })
     
    },
    //获取是否是会员
    getIFmenber(e) {
        let userInfo = app.UserLogin.get('userInfo');
        if (userInfo.userNo) {
            app.Formdata.get('/openapi/express/wechatapplet/express/user/rechargeUserInfo', {
                userNo: userInfo.userNo
            }, (res) => {
                
                if (res.code == "0000" && res.data) {
                    this.setData({
                        rechargeMember: res.data.rechargeMember,
                        rechargeUserInfo: res.data
                    }, () => {
                        if (res.data.rechargeMember == 'true') {
                            wx.navigateTo({
                                url: '/pages/webView/viewAgreement?rechargeMember=1'
                            })
                        } else if (res.data.firstCharge == 'true') {
                            wx.navigateTo({
                                url: '/pages/memberInfo/openMember/index?rechargeUserInfo=' + JSON.stringify(res.data),
                            })
                        } else {
                            wx.navigateTo({
                                url: '/pages/memberInfo/openMember/index'
                            })
                        }
                    })
                }
            })
        } else {
            wx.showToast({
                title: '客官还未登录，请登录浏览',
                icon: 'none',
                success(e) {
                    return false
                }
            })
        }
    },
    getLocation() {
        let _this = this;
        //获取当前地址
        wx.getLocation({
            type: 'gcj02',
            success(res) {
                app.UserLogin.set('location',res);
                _this.setData({
                    latitude: res.latitude,
                    longitude: res.longitude
                }, (data) => {
                    app.globalData.latitude = res.latitude;
                    app.globalData.longitude = res.longitude;
                    _this.getNearbyStore();
                })
            },

            fail(err) {
                _this.getNearbyStore();
                wx.showModal({
                    title: '提示',
                    content: '您未授权位置信息，您可以在小程序设置界面（「右上角」 - 「关于」 - 「右上角」 - 「设置」）中控制对该小程序的授权状态',
                    showCancel: false,
                    confirmText: '我知道了', 
                })
            } 
        })
    },
    onLoad: function(query) {
        let _this = this;
        let scene = decodeURIComponent(query.scene);
        let location = app.UserLogin.get('location') || null;
        if (scene) {
            _this.setData({
                stationNo: scene
            })
        }
        wx.login({
            success(data) {
                _this.setData({
                    codeInfo: data
                })
            }
        }) 
        if (app.globalData.employId && app.globalData.employId != '') {
            _this.getImgList();
            _this.getNearbyStore();
        } else {
            app.employIdCallback = employId => { 
                if (employId != '') {
                    _this.getImgList();
                    _this.getNearbyStore();
                }
            }
        }
    },
    getNearbyStore(){
        let _this = this;   
            let parms = {
                latitude: _this.data.latitude ? _this.data.latitude : 0,
                longitude: _this.data.longitude ? _this.data.longitude : 0,
                page: 1,
                page_size: 100
            }
            app.FormdataPHP.post('/wxapp/mobile/nearbyStore', parms, (res) => {
                if (res.data.store_list.length>0){
                        res.data.store_list.map((item,index)=>{
                             res.data.store_list[index].coup_info.receive = item.coup_info.receive.join(',');
                            res.data.store_list[index].coup_info.back = item.coup_info.back.join(',');
                    }) 
                    this.setData({
                        store_list: res.data.store_list
                    })
                }else{
                    this.setData({
                        store_list: res.data.store_list
                    });
                }  
            })
    },
    //获取是否为会员
    getMernber() {
        let userInfo = app.UserLogin.get('userInfo');
        if (userInfo.userNo) {
            app.Formdata.get('/openapi/express/wechatapplet/express/user/rechargeUserInfo', {
                userNo: userInfo.userNo
            }, (res) => {
                if (res.code == "0000" && res.data) {
                    this.setData({
                        rechargeMember: res.data.rechargeMember,
                        rechargeUserInfo: res.data
                    })
                }
            })
        }
    },

    //优惠券
    changeHide() {
        this.setData({
            isConpun: false
        })
    },
    //注册券
    changeRec() {
        this.setData({
            isReceive: false
        })
    },
    goToshop(e){ 
        let data = e.currentTarget.dataset.station;
        wx.navigateTo({
            url: '/pages/shopMall/index?station=' + JSON.stringify(data),
        })
    },
    //获取优惠券
    getCouponlist(e){
        app.FormdataPHP.get('/wxapp/coupon/list', { service:2},(res) => {
            if(res.code == '0000'){ 
                if (res.data.coup_list.length>0){
                    this.setData({
                        isReceive: true,
                        recCoupon: res.data.coup_list
                    })
                }else{
                    wx.showToast({
                        title: '小站优惠券即将发行',
                        icon:'none'
                    })
                }
            }
        })
    },
    //领取优惠券
    getCoupID(e){
        console.log(e);
        let id = e.currentTarget.dataset.id;
        let service = e.currentTarget.dataset.service;
        let index = e.currentTarget.dataset.index;
        app.FormdataPHP.post('/wxapp/coupon/receive', { service: service, coup_id:id},(res) =>{
            console.log(res)
            if(res.code == '0000'){
                let key = 'recCoupon['+index+'].status';
                this.setData({
                    [key]: 0
                })
            }
        })
    },
    //注册领券
    getReceive(e){
        let userInfo = app.UserLogin.get('userInfo');
        if (userInfo.isFirstLoginSxe == 1){
            app.FormdataPHP.post('/wxapp/coupon/registerReceive', {}, (res) => {
                console.log(res)
                if (res.data.coup_list.length>0){
                    this.setData({
                        isConpun: true,
                        regisCoupList: res.data.coup_list
                    })
                } 
            })
        }  
    }
})