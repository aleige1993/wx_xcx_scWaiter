// pages/ schoolCar/index.js
let app =getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        sheetShow:false, 
        shopArr: [],
        shopIndex: '',
        carArr: [{
                name: 'A1',
                id: '5'
            },
            {
                name: 'A2',
                id: '6'
            },
            {
                name: 'A3',
                id: '7'
            },
            {
                name: 'B1',
                id: '8'
            },
            {
                name: 'B2',
                id: '9'
            },
            {
                name: 'C1',
                id: '1'
            },
            {
                name: 'C2',
                id: '2'
            },
            {
                name: 'C3',
                id: '3'
            },
            {
                name: 'C4',
                id: '4'
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
        repeatItem:''
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
    //提交
    formSubmit(e) {
        console.log(e)
        if (this.data.shopItem == '') {
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
        if (!this.data.checked) {
            app.Tools.showToast('请同意《用户服务协议》');
            return false;
        }
        let parms = {
            stationNo: this.data.shopItem,
            type: this.data.carIitem,
            userName: e.detail.value.username,
            gender: this.data.sexItem,
            card: e.detail.value.idcard,
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
            } else if (res.code == "0001" && res.data != null){
                wx.showModal({
                    title: '温馨提示',
                    content: '您已经报名成功，不可重复报名',
                    showCancel: false,
                    confirmText: '查看信息',
                    success(rult) {
                         _this.data.carArr.filter((item)=>{
                             console.log(item)
                            if (item.id == res.data.type){
                                console.log(item.id == res.data.type)
                                return res.data.type = item.name
                            }
                        })
                        _this.setData({
                            sheetShow: true ,
                            repeatItem:res.data
                        })
                    }
                })
            }
        });
    },
    onClose(e){
        this.setData({ sheetShow: false });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.initValidate();
        app.Formdata.get('/openapi/express/wechatapplet/express/station/query',{},(res)=>{
            console.log(res);
            if (res.code=='0000') {
                    this.setData({
                        shopArr:res.data
                    })
            }
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