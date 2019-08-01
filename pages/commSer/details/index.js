// pages/commSer/details/index.js
let app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        contentId:null,
        info:null,
        isHome:false
    },
    //跳转商品详情
    newGoods(e) {
        let stid = e.currentTarget.dataset.stid;
        let barcode = e.currentTarget.dataset.barcode;
        wx.navigateTo({
            url: '/pages/shopMall/goodDetails/index?stid=' + stid + '&barcode=' + barcode + '&types=1',
        })
    },
    //点赞
    getRecordLv(e){
        let _this = this;
        let status = e.currentTarget.dataset.status; 
        app.FormdataNewPHP.post('/user.info/recordLv', { content_id: _this.data.contentId, status: status },(res) => {
            if(res.code == '0000') {
                if (status == '1'){
                    _this.setData({
                        'info.lv': _this.data.info.lv/1 + 1,
                        'info.is_lv':1
                    })
                }else{
                    _this.setData({
                        'info.lv': _this.data.info.lv/1 - 1,
                        'info.is_lv': 0
                    })
                }
            }
        })
    },  
    //关注
    getAttention(e) {
        console.log(e)
        let _this = this;
        let stId = e.currentTarget.dataset.stid;
        let status = e.currentTarget.dataset.status; 
        let parms = {
            st_id: stId,
            status: status
        }
        app.FormdataNewPHP.post('/user.attention/attention', parms, (res) => {
            console.log(res);
            if (res.code == '0000') { 
                if (status == '1') {
                    wx.showToast({
                        title: '关注成功',
                        success() {
                            _this.setData({
                                'info.attention': 1
                            })
                        }
                    })
                } else {
                    wx.showToast({
                        title: '取关成功',
                        success() {
                            _this.setData({
                                'info.attention': 0
                            })
                        }
                    })
                }
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options);
        if (options.contentId){
            this.setData({
                contentId: options.contentId
            },()=>{
                this.getNewContent();
            })
        }
        if (options.types == 1){
            this.setData({
                isHome:true
            })
        }
    },
    getNewContent(e){
        let _this = this;
        wx.showLoading({
            title: '加载中...',
        }) 
        try {
            app.FormdataNewPHP.get('/user.info/info', { content_id: _this.data.contentId }, (res) => {
                console.log(res);
                if (res.code == '0000') {
                    let html = res.data.info;
                    html.detail.map((item, index) => {
                        if (item.content_type == 'content') {
                            html.detail[index].content = item.content.replace(/<img/gi, '<img style="width:100% !important" ');
                        }
                    })
                    _this.setData({
                        info: html
                    })
                }
            })
        } catch (err) {
            setTimeout(()=>{
                app.FormdataNewPHP.get('/user.info/info', { content_id: _this.data.contentId }, (res) => {
                    console.log(res);
                    if (res.code == '0000') {
                        let html = res.data.info;
                        html.detail.map((item, index) => {
                            if (item.content_type == 'content') {
                                html.detail[index].content = item.content.replace(/<img/gi, '<img style="width:100% !important" ');
                            }
                        })
                        _this.setData({
                            info: html
                        })
                    }
                })
            },1000);
        } 
        setTimeout(()=>{
            wx.hideLoading();
        },2000)
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
        let info = this.data.info;
        return {
            title: info.title,
            path: '/pages/commSer/details/index?contentId=' + info.content_id + '&types=1',
            imageUrl: info.cover_image
        }
    }
})