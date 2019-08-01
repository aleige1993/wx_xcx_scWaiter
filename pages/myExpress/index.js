// pages/checkExpress/index.js
let app = getApp();
let multiArray = [{
        id: 0,
        text: '今天',
        disabled: false,
        children: []
    },
    {
        id: 1,
        disabled: false,
        text: '明天',
        children: []
    }
]
Page({

    /**
     * 页面的初始数据
     */
    data: {
        sreachForm: {
            page: 1,
            limit: 10,
            status: 1,
            expressNo: ''
        },
        expressList: [],
        multiArray: [],
        show: false,
        mainActiveIndex: 0,
        itemPrame:{
            items:'',
            index:''
        },
        rechargeMember:''
    },
    onshow(e) {
        console.log(e);
        let item = e.currentTarget.dataset.items;
        let index = e.currentTarget.dataset.index;
        this.setData({
           'itemPrame.items': item,
            'itemPrame.index': index,
            'activeId': 0,
            'mainActiveIndex': 0
        });
        let prames = {
            stationNo: item.stationNo,
            busiType: '1'
        }
        app.Formdata.get('/openapi/express/wechatapplet/express/delivery/listForC', prames, (res) => {
            console.log(res)
            if (res.code == '0000') {
                if (res.data.today.length<=0){
                    app.Tools.showToast('今天没时间配送，客官请预约明天的吧')
                }
                multiArray[0].children = res.data.today;
                multiArray[1].children = res.data.tomorrow;
                    this.setData({
                        multiArray: multiArray,
                        show: true
                    })
            }
        })
    },
    onClose() {
        this.setData({
            show: false
        });
    },
    onClickNav({
        detail = {}
    }) {
        this.setData({
            mainActiveIndex: detail.index || 0,
            activeId: 0,
            textTime: ''
        });
    },
    onClickItem({
        detail = {}
    }) {
        let _this = this;
        let dataName = "";
        wx.showModal({
            title: '温馨提示',
            content: '是否确认预约，预约过后不可更改',
            success(res) {
                if (res.confirm) {
                    if (_this.data.mainActiveIndex == 0) {
                        dataName = app.utils.GetDateStr(0);
                    } else if (_this.data.mainActiveIndex == 1) {
                        dataName = app.utils.GetDateStr(1);
                    }
                    let textName = detail.text;
                    _this.setData({
                        activeId: detail.id,
                        textTime: dataName + ':' + textName,
                        textName: textName,
                        dataName: dataName
                    });
                    let prames = {
                        id: _this.data.itemPrame.items.id,
                        stationNo: _this.data.itemPrame.items.stationNo,
                        deliveryId: detail.id,
                        appointmentDate: dataName
                    }
                    app.Formdata.post('/openapi/express/wechatapplet/express/delivery/chooseForExpress', prames, (rult) => {
                        console.log(rult)
                        if (rult.code == '0000') {
                            _this.onClose();
                            wx.showToast({
                                title: '成功',
                                icon: 'success'
                            })
                            let deliveryId = 'expressList[' + _this.data.itemPrame.index +'].deliveryId';
                            let text = 'expressList[' + _this.data.itemPrame.index + '].text'
                            _this.setData({
                                [deliveryId]: detail.id,
                                [text]: dataName +" "+textName
                            })
                        }else{
                            _this.onClose();
                        }
                    })
                } else if (res.cancel) {
                  _this.onClose();
                }
            }
        })


        // setTimeout(() => {
        //     _this.onClose();
        // }, 500)
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
    onSearch(e) {
        this.setData({
            'sreachForm.page': 1,
            'expressList': []
        })
        this.loadExpressList();
    },

    onChange(e) {
        this.setData({
            'sreachForm.expressNo': e.detail
        })
    },

    getIndex(e) {
        let index = e.currentTarget.dataset.index
        this.setData({
            'sreachForm.page': 1,
            'sreachForm.status':index,
            'sreachForm.expressNo': '',
            'expressList': []
        })
        this.loadExpressList();
    },

    loadExpressList() {
        let _this = this;
        wx.showLoading({
            title: '加载中...',
        });
        app.Formdata.get('/openapi/express/wechatapplet/express/order/queryForUser', this.data.sreachForm, function(res) {
            if (res.success && res.success === 'true') {
                if (!res.data || !res.data.length) {
                    if (_this.data.sreachForm.page > 1) {
                        app.Tools.showToast('没有更多的数据了')
                    }
                } else {
                    _this.setData({
                        expressList: _this.data.expressList.concat(res.data)
                    })
                }
                setTimeout(function() {
                    wx.hideLoading();
                }, 500);
                setTimeout(function() {
                    wx.stopPullDownRefresh();
                }, 1000);
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.loadExpressList();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        let _this = this;
        wx.getSystemInfo({
            success: function(res) {
                _this.setData({
                    scrollHeight: res.windowHeight - 88 + 'px'
                })
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
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        this.getMernber();
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
        this.setData({
            "sreachForm.page": 1,
            'expressList': []
        })
        this.loadExpressList();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        this.setData({
            "sreachForm.page": ++this.data.sreachForm.page
        })
        this.loadExpressList();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})