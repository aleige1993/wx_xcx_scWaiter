//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        isLogin: false,
        isShow: false,
        state: 1,
        banner: {
            bannerArr:[],
            indicatorDots: true,
            autoplay: true,
            interval: 5000,
            duration: 1000,
        },
        headNews: {
            list: [{
                url: 'http://baidu.com',
                title: '不明白汽车尾标是啥意思？一分钟教你看懂不明白汽车尾标是啥意思？一分钟教你看懂'
            }, {
                url: 'http://baidu.com',
                title: '头条测试'
            }],
            autoplay: true,
            interval: 5000,
            duration: 1000
        },
        sreachForm: {
            page: 1,
            limit: 1000,
            status: 1,
            expressNo: ''
        },
        expressList: [],
        openmenber:[],
        rechargeMember:''
    },

    loadExpressList() {
        let _this = this;
        // wx.showLoading({
        //   title: '加载中...',
        // });
        app.Formdata.get('/openapi/express/wechatapplet/express/order/queryForUser', this.data.sreachForm, function (res) {
            if (res.success && res.success === 'true') {
                if (!res.data || !res.data.length) {
                    if (_this.data.sreachForm.page > 1) {
                        // app.Tools.showToast('没有更多的数据了')
                    }
                } else {
                    _this.setData({
                        expressList: _this.data.expressList.concat(res.data)
                    })
                }
                // setTimeout(function () {
                //   wx.hideLoading();
                // }, 500);
                setTimeout(function () {
                    wx.stopPullDownRefresh();
                }, 1000);
            }
        })
        },
    //跳转banner详情
    goToViewDetails(e){
        if (e.currentTarget.dataset.url){
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
                    isShow: false
                })
        }
    },
    clickTost() {
        wx.showModal({
            content: '客官,我们正在建设敬请期待',
            showCancel: false,
            confirmText: '我知道了',
            success(res) {
                if (res.confirm) {
                }
            }
        })
    },
    onShow: function () {
        this.setData({
            isShow: !app.UserLogin.get('wxUserInfo'),
            isLogin: app.UserLogin.get('userInfo')
        })
        if (this.data.isLogin) {
            this.setData({
                expressList: [],
                'sreachForm.page': 1
            });
            this.loadExpressList();
        }
       
    },
    onHide:function(){
    },
    getImgList(position,arr){
        app.Formdata.get('/openapi/express/wechatapplet/express/advert/queryByPosition', { advPosition: position }, (res) => {
            if (res.code == "0000") {
                this.setData({
                    [arr]: res.data
                })
            }
        })
    },
    //获取是否是会员
    getIFmenber(e){
        let userInfo = app.UserLogin.get('userInfo');
        console.log(userInfo)
        if (userInfo.userNo){
            app.Formdata.get('/openapi/express/wechatapplet/express/user/rechargeUserInfo', { userNo: userInfo.userNo }, (res) => {
                if (res.code == "0000" && res.data) {
                    this.setData({
                        rechargeMember: res.data.rechargeMember
                    },()=>{
                        if (res.data.rechargeMember == 'true') {
                            wx.navigateTo({
                                url: '/pages/webView/viewAgreement?rechargeMember=1'
                            })
                        } else {
                            wx.navigateTo({
                                url: '/pages/memberInfo/openMember/index'
                            })
                        }
                    })
                }
            })
        }else{
            wx.showToast({
                title: '客官还未登录，请登录浏览',
                icon:'none',
                success(e){
                    return false
                }
            })
        }
       
    },
    onLoad: function () {
        this.getImgList('1','banner.bannerArr');
        this.getImgList('7', 'openmenber');
    },

    // onReachBottom: function () {
    //     if (this.data.isLogin) {
    //         this.setData({
    //             "sreachForm.page": ++this.data.sreachForm.page
    //         })
    //         this.loadExpressList();
    //     }
    // }
})
