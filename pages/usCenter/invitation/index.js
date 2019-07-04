// pages/usCenter/invitation/index.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isPopup: false,
        fenxBox: false,
        userNo: null,
        coupList: [],
        ruleContent: [],
        userList: [],
        imageBannr: '',
        fenxImage: '',
        friendImage: ''
    },
    baoCun(e) {
        let _this = this;
        let imgSrc = this.data.friendImage;
        wx.getSetting({
            success(res) {
                if (!res.authSetting['scope.writePhotosAlbum']) {
                    wx.authorize({
                        scope: 'scope.writePhotosAlbum',
                        success() {

                        }
                    })
                }
            }
        });
        wx.downloadFile({
            url: imgSrc,
            success: function(res) { 
                wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success: function(data) {
                        _this.setData({
                            fenxBox: false
                        })
                        wx.showToast({
                            title: '保存成功',
                            icon: 'success',
                            duration: 2000
                        })
                    },
                    fail: function(err) {
                        if (err.errMsg == "saveImageToPhotosAlbum:fail auth deny") {
                            wx.openSetting({
                                success(settingdata) {
                                    if (settingdata.authSetting['scope.writePhotosAlbum']) {
                                        console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                                    } else {
                                        console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                                    }
                                }
                            })
                        }
                    },
                    complete(rult) { 
                        if (rult.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
                            wx.openSetting({
                                success(settingdata) {
                                    if (settingdata.authSetting['scope.writePhotosAlbum']) {
                                        console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                                    } else {
                                        console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                                    }
                                }
                            })
                        }
                    }
                })
            }
        })
    },
    fenxClear() {
        this.setData({
            fenxBox: false
        })
    },
    showFenx() {
        this.setData({
            isPopup: false,
            fenxBox: true
        })
    },
    onClose() {
        this.setData({
            isPopup: false
        })
    },
    showPoper(e) {
        app.Tools.getFormID(e);
        this.setData({
            isPopup: true
        })
    },
    //获取图片，分享图片
    getImages() {
        app.Formdata.get('/openapi/express/wechatapplet/express/advert/queryByPosition', {
            advPosition: '12'
        }, (res) => {
            if (res.code == "0000") {
                this.setData({
                    imageBannr: res.data[0].advImage
                })
            }
        });
    },
    getFriendImage() {
        wx.showLoading({
            title: '加载图片...',
        })
        app.Formdata.get('/openapi/express/wechatapplet/express/invitconfig/queryQrcode', {}, (res) => {
            if (res.code == "0000") {
                console.log(res);
                this.setData({
                    friendImage: res.data.invitQrcode
                })
            }
        });
        setTimeout(()=>{
            wx.hideLoading();
            wx.stopPullDownRefresh();
        },2000)
    },
    getFenxImage() {
        app.Formdata.get('/openapi/express/wechatapplet/express/advert/queryByPosition', {
            advPosition: '14'
        }, (res) => {
            if (res.code == "0000") {
                this.setData({
                    fenxImage: res.data[0]
                })
            }
        });
    },
    //获取优惠券
    getConput(startTime, endTime) {
        app.FormdataPHP.get('/wxapp/coupon/inviteCouponList', {
            start_tm: startTime,
            end_tm: endTime
        }, (res) => {
            if (res.code == '0000') {
                this.setData({
                    coupList: res.data.coup_list
                })
            }
        })
    },
    //获取规则
    getExtsofimy() {
        let _this = this;
        app.Formdata.get('/openapi/express/wechatapplet/express/invitconfig/query', {}, (res) => {
            console.log(res);
            if (res.code == '0000') {
                if (res.data) {
                    let ruleContent = res.data.ruleContent.split('#');
                    _this.setData({
                        ruleContent: ruleContent,
                        showNum: res.data.showNum
                    }, () => {
                        _this.getQueryUser(res.data.showNum, res.data.startTime, res.data.endTime);
                        _this.getConput(res.data.startTime, res.data.endTime)
                    })
                } else {
                    wx.showModal({
                        title: '温馨提示',
                        content: '客官！活动未开启，敬请关注~',
                        showCancel: false,
                        confirmText: '我知道了',
                        success(modl) {
                            if (modl.confirm) {
                                wx.navigateBack({
                                    delta: 1
                                })
                            }
                        }
                    })
                }
            }
        })
    },
    //获取好友
    getQueryUser(invitLimitNum, startTime, endTime) {
        let parms = {
            invitLimitNum: invitLimitNum,
            invitStartTime: startTime,
            invitEndTime: endTime,
            page: 1,
            limit: 1000
        }
        app.Formdata.get('/openapi/express/wechatapplet/express/invitconfig/queryUser', parms, (res) => {
            if (res.code == '0000') {
                console.log('userList', res)
                this.setData({
                    userList: res.data
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            userNo: app.UserLogin.get('userInfo') ? app.UserLogin.get('userInfo').userNo : ''
        })
        this.getImages();
        this.getFenxImage();
        this.getExtsofimy();
        this.getFriendImage();
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
        this.getFriendImage();
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
        const userNo = this.data.userNo;
        const fenxImage = this.data.fenxImage;
        return {
            title: fenxImage.advName,
            path: '/pages/index/index?inviterNo=' + userNo,
            imageUrl: fenxImage.advImage,
            success: function(res) {
                console.log('成功', res)
            }
        }
    }
})