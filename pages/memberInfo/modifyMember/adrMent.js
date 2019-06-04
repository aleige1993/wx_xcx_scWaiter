// pages/memberInfo/modifyMember/adrMent.js
let app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        radio:0,
        page: '1',
        listItme: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },
    onChange(e) {
        let id = e.detail;
        console.log('id',id)
        this.setData({
            radio: id
        })
        if (id){
            app.Formdata.post('/openapi/express/wechatapplet/express/userAddr/setDefault', { 'id': id} , (res)=>{
                if(res.code == '0000') {
                    wx.showToast({
                        title: '设置成功',
                    })
                }
            })
        }
    },
    addAdr() {
        wx.navigateTo({
            url: '/pages/memberInfo/modifyMember/modify',
        })
    },
    onModify(e) {
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/memberInfo/modifyMember/modify?id=' + id
        })
    },
    onCler(e) {
        let id = e.currentTarget.dataset.id;
        let _this = this;
        app.Formdata.post('/openapi/express/wechatapplet/express/userAddr/del', {
            'id': id
        }, (res) => {
            if (res.code == '0000') {
                wx.showModal({
                    title: '温馨提示',
                    content: '确认删除吗',
                    success(res) {
                        if (res.confirm) {
                            wx.showToast({
                                title: '删除成功'
                            })
                            _this.getListitme();
                        } else if (res.cancel) {}
                    }
                })

            }
        })
    },
    //获取列表
    getListitme() {
        wx.showLoading({
            title: '加载中...',
            mask:true
        })
        app.Formdata.get('/openapi/express/wechatapplet/express/userAddr/list', {
            'page': this.data.page,
            'limit': 10000
        }, (res) => {
            if (res.code == '0000') {
                let radio ='';
                res.data.map((item)=>{
                    if (item.flag == '1'){
                        this.setData({
                            radio:item.id
                        })
                    }
                })
                this.setData({
                    listItme: res.data
                })
            }
        })
       setTimeout(()=>{
           wx.hideLoading();
       },2000)
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
        this.getListitme();
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