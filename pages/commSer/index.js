// pages/commSer/index.js
let app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        scroll_ser: true,
        tabPanl: 1,
        imgUrls: [
            'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
            'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
            'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
        ],
        indicatorDots: true,
        autoplay: true,
        interval: 3000,
        duration: 1000,
        navList: [],
        page: 1,
        pageSize: 10,
        newList: [],
        storeList: [],
        isNULL: false,
        isloading: false,
        nodata: false
    },
    onGoback(e) {
        let typeStud = e.currentTarget.dataset.items;
        if (typeStud.type == '1') {
            app.FormdataNewPHP.post('/user.info/recordPv', {
                content_id: typeStud.content_id
            }, (res) => {
                wx.navigateTo({
                    url: '/pages/shopMall/goodDetails/index?stid=' + typeStud.st_id + '&barcode=' + typeStud.barcode + '&types=1',
                })
            })
        } else if (typeStud.type == '2') {
            wx.navigateTo({
                url: '/pages/commSer/details/index?contentId=' + typeStud.content_id,
            })
        }
    },
    //详情
    newTrend(e) {
        let contentId = e.currentTarget.dataset.contentid;
        wx.navigateTo({
            url: '/pages/commSer/details/index?contentId=' + contentId,
        })
    },
    //底部导航切换
    onTabItemTap(){
        let _this = this;
        wx.showLoading({
            title: '加载中...',
            mask: true
        })
        _this.setData({
            newList:[],
            page: 1,
            isNULL: false,
            isloading: false,
            nodata: false
        },()=>{
            _this.getNavTit();  
        })
    },
    //跳转商品详情
    newGoods(e) {
        let stid = e.currentTarget.dataset.stid;
        let barcode = e.currentTarget.dataset.barcode;
        let contentId = e.currentTarget.dataset.contentid;
        console.log(contentId)
        app.FormdataNewPHP.post('/user.info/recordPv', {
            content_id: contentId
        }, (res) => {
            wx.navigateTo({
                url: '/pages/shopMall/goodDetails/index?stid=' + stid + '&barcode=' + barcode + '&types=1',
            })
        })
    },
    onTabpanl(e) {
        this.setData({
            tabPanl: e.detail.index,
            page: 1,
            newList: [],
            isNULL: false,
            nodata: false
        }, () => {
            this.getList();
        })
    },
    // 获取导航栏
    getNavTit() {
        app.FormdataNewPHP.get('/user.info/categoryList', {}, (res) => {
            console.log(res);
            if (res.code == '0000') {
                this.setData({
                    navList: res.data.category_list
                }, () => {
                    this.getList();
                })
            }
        })
    },
    follbank() {
        this.setData({
            tabPanl: 0,
            page: 1
        }, () => {
            this.getList();
        })
    },
    //获取列表
    getList() {
        let _this = this;
        _this.setData({
            isloading: true
        })
        let parms = {
            ca_id: _this.data.navList[_this.data.tabPanl].id,
            page: _this.data.page,
            page_size: _this.data.pageSize
        }
        app.FormdataNewPHP.get('/user.info/list', parms, (res) => {
            console.log(res.data);
            if (res.code == '0000') {
                if (res.data.store_list.length > 0) {
                    this.setData({
                        storeList: res.data.store_list,
                        scroll_ser: false
                    })
                } else {
                    if (_this.data.page == 1) {
                        if (res.data.list.length == 0) {
                            _this.setData({
                                nodata: true
                            })
                        }
                    }
                    if (_this.data.page > 2) {
                        if (res.data.list.length == 0) {
                            _this.setData({
                                isNULL: true
                            })
                        }
                    }
                    _this.setData({
                        newList: _this.data.newList.concat(res.data.list),
                        scroll_ser: true
                    })
                }
            }
        })
        setTimeout(() => {
            _this.setData({
                isloading: false
            })
            wx.stopPullDownRefresh();
            wx.hideLoading();
        }, 1000)
    },
    //关注
    getAttention(e) {
        console.log(e)
        let _this = this;
        let stId = e.currentTarget.dataset.stid;
        let status = e.currentTarget.dataset.status;
        let index = e.currentTarget.dataset.index;
        let parms = {
            st_id: stId,
            status: status
        }
        let key = 'storeList[' + index + '].attention';
        if (status == '1') {
            wx.showToast({
                title: '关注成功',
                success() {
                    _this.setData({
                        [key]: 1
                    })
                }
            })
        } else {
            wx.showToast({
                title: '取关成功',
                success() {
                    _this.setData({
                        [key]: 0
                    })
                }
            })
        }
        app.FormdataNewPHP.post('/user.attention/attention', parms, (res) => {
            if (res.code == '0000') {}
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // this.getNavTit();
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
        wx.showLoading({
            title: '刷新中...',
            mask: true
        })
        let _this = this;
        _this.setData({
            page: 1,
            newList: [],
            isNULL: false,
            nodata: false
        }, () => {
            _this.getList();
        })
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        console.log(123);
        let _this = this;
        _this.setData({
            page: ++_this.data.page
        }, () => {
            if (!_this.data.isNULL) {
                _this.getList();
            }
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})