
let app =getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        sheetShow:false, 
        shopArr: [],
        shopIndex: '',
        carArr: [
            {
                name: 'B2-10800元',
                id: '9'
            },
            {
                name: 'C1-3280元',
                id: '1'
            },
            {
                name: 'C2-3780元',
                id: '2'
            }
        ],
        carIndex: '',
        sexIndex: '',
        sexArr: [{
                name: '男',
                id: "1"
            },
            {
                name: '女',
                id: "2"
            }
        ],
        checked:false,
        shopItem: '',
        carIitem: '',
        sexItem: '',
        repeatItem:'',
        imgArr:'',
        mobile:'',
        stationSchool:''
    },
    onChange(e) {
        this.setData({
            checked: !this.data.checked
        })
    },
    // 选择店铺
    shoprChange(e) {
        this.setData({
            'shopIndex': e.detail.value,
            'shopItem': this.data.shopArr[e.detail.value].stationNo
        })
    },
    // 选择车型
    carChange(e) {
        this.setData({
            'carIndex': e.detail.value,
            carIitem: this.data.carArr[e.detail.value].id
        })
    },
    // 选择性别
    sexChange(e) {
        this.setData({
            'sexIndex': e.detail.value,
            sexItem: this.data.sexArr[e.detail.value].id
        })
    },
    //跳转web-view详情
    goToViewDetails(e) {
        let weburl = encodeURIComponent('https://cms.songchewang.com/#/index/articleDetail?noaction=true&showall=false&id=107')
        if (weburl) {
            console.log(weburl)
            wx.navigateTo({
                url: '/pages/webView/viewDetails?url=' + weburl
            })
        }
    },
    //提交
    formSubmit(e) {
        console.log(e)
        if (this.data.stationSchool.stationNo == '') {
            app.Tools.showToast('请选择小站');
            return false;
        }
        if (this.data.carIitem == '') {
            app.Tools.showToast('请选择学习车型');
            return false;
        }
        if (this.data.sexItem == '') {
            app.Tools.showToast('请选择性别');
            return false;
        }
        if (!this.WxValidate.checkForm(e)) {
            const error = this.WxValidate.errorList[0];
            wx.showToast({
                title: error.msg,
                icon: 'none',
                duration: 2000
            })
            return false
        }
        // if (!this.data.checked) {
        //     app.Tools.showToast('请同意《用户服务协议》');
        //     return false;
        // }
        let parms = {
            stationNo: this.data.stationSchool.stationNo,
            type: this.data.carIitem,
            userName: e.detail.value.username,
            gender: this.data.sexItem,
            mobile: e.detail.value.mobile
        }
        app.Formdata.post('/openapi/express/wechatapplet/express/drive/save', parms, (res)=>{
            let _this = this;
            if (res.code == "0000") {
                wx.showModal({
                    title: '报名成功',
                    content: '请前往小站登记领取报名资料',
                    showCancel:false,
                    confirmText:'我知道了',
                    success(res) {
                        if (res.confirm) {
                            wx.navigateBack({ delta: 1 });
                        }
                    }
                })
            } else if (res.code == "0001" || res.data != null){
                wx.showToast({
                    title:'报名失败，不可重复报名',
                    icon:'none'
                })
            }
        });
    },
    onClose(e){
        this.setData({ sheetShow: false });
    },
    //查询报名
    getPaomin(e){
        let  _this = this;
        app.Formdata.get('/openapi/express/wechatapplet/express/drive/detail', {}, (res) => {
            if(res.code == '0000'){
                wx.showModal({
                    title: '温馨提示',
                    content: '您已经报名成功，不可重复报名',
                    showCancel: false,
                    confirmText: '查看信息',
                    success(rult) {
                        _this.data.carArr.filter((item) => {
                            if (item.id == res.data[0].type) {
                                return res.data[0].type = item.name
                            }
                        })
                        _this.setData({
                            sheetShow: true,
                            repeatItem: res.data[0]
                        })
                    }
                })
            }else{
                _this.setData({
                    mobile: app.UserLogin.get('userInfo').mobile
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    // shoplist(){
    //     app.Formdata.get('/openapi/express/wechatapplet/express/station/query', {}, (res) => {
    //         console.log(res);
    //         if (res.code == '0000') {
    //             this.setData({
    //                 shopArr: res.data
    //             })
    //         }
    //     })
    // },
    onLoad: function(options) {
        this.initValidate();
        // this.shoplist();
        app.Formdata.get('/openapi/express/wechatapplet/express/advert/queryByPosition', { advPosition: '3' }, (res) => {
            console.log(res)
            if (res.code == "0000") {
                this.setData({
                    'imgArr': res.data
                })
            }
        })
        this.setData({
            mobile: app.UserLogin.get('userInfo').mobile
        })
    
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
        console.log(app.globalData.stationSchool);
        if (app.globalData.stationSchool) {
            this.setData({
                stationSchool: app.globalData.stationSchool
            })
        }
        this.getPaomin();
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

    },
    initValidate() {
        const rules = {
            username: {
                required: true
            },
            mobile: {
                required: true,
                tel: true
            }
        }

        const messages = {
            username: {
                required: "请输入姓名"
            },
            mobile: {
                required: "请输入手机号",
                tel: "请输入正确的手机号"
            }
        }
        // 创建实例对象 
        this.WxValidate = new app.WxValidate(rules, messages)
    }
})