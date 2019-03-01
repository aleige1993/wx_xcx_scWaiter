// pages/memberInfo/openMember/index.js
// pages/ schoolCar/index.js
let app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        shopArr: [],
        shopIndex: '',
        endTime: (new Date()).toLocaleDateString().split('/').join('-'),
        dateTime:'',
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
        checked: false,
        shopItem: '',
        carIitem: '',
        sexItem: '',
        imgArr: [],
        address:[]
    },
    onChange(e) {
        this.setData({
            checked: !this.data.checked
        })
    },
    //跳转banner详情
    goToViewDetails(e) {
        console.log(e)
        let weburl = e.currentTarget.dataset.url;
        if (weburl) {
            wx.navigateTo({
                url: '/pages/webView/viewDetails?url=' + weburl,
            })
        }
    },
    // 选择店铺
    shoprChange(e) {
        this.setData({
            'shopIndex': e.detail.value,
            'shopItem': this.data.shopArr[e.detail.value].stationNo
        })
    },
    // 选择车型
    // carChange(e) {
    //     this.setData({
    //         'carIndex': e.detail.value,
    //         carIitem: this.data.carArr[e.detail.value].id
    //     })
    // },
    // // 选择性别
    sexChange(e) {
        this.setData({
            'sexIndex': e.detail.value,
            sexItem: this.data.sexArr[e.detail.value].id
        })
    },
    //获取日期
    onDateChange(e){
        this.setData({
            dateTime: e.detail.value
        })
    },
    //提交
    formSubmit(e) {
        console.log(e)
        if (this.data.shopItem == '') {
            app.Tools.showToast('请选择小站');
            return false;
        }
        if (e.detail.value.username == '') {
            app.Tools.showToast('请输入姓名');
            return false;
        }
        if (this.data.sexItem == '') {
            app.Tools.showToast('请选择性别');
            return false;
        }
        
        if (this.data.dateTime == '') {
            app.Tools.showToast('请选择生日日期');
            return false;
        }
        let parms = {
            stationNo: this.data.shopItem,
            nickName: e.detail.value.username,
            birth: e.detail.value.dateTime,
            sex: this.data.sexItem
        }
        app.Formdata.post('/openapi/express/wechatapplet/express/user/saveRechargeUser', parms, (res) => {
            console.log(res);
            if (res.code == "0000") {
                wx.redirectTo({
                    url: '/pages/laundryOrder/payMent/index?orderno=' + res.data.orderNo + '&payType=2'
                })
               
            }
        });
    },
    //跳转管理地址
    goToadrment(e) {
        wx.navigateTo({
            url: '/pages/memberInfo/modifyMember/adrMent',
        })
    },
    //获取小站列表
    shoplist(){
        app.Formdata.get('/openapi/express/wechatapplet/express/station/query', {}, (res) => {
            console.log(res);
            if (res.code == '0000') {
                this.setData({
                    shopArr: res.data
                })
            }
        })
    },
    //跳转会员说明
    goToAgrment(){
        wx.navigateTo({
            url: '/pages/webView/viewAgreement',
        })
    },
    //获取地址信息
    getAddress(){
        app.Formdata.get('/openapi/express/wechatapplet/express/userAddr/detail', { flag:"1"}, (res)=>{
            if(res.code == "0000"){
                console.log(res)
                this.setData({
                    address: res.data.provinceName ? [res.data.provinceName, res.data.cityName, res.data.districtName] :'未设置地址'
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.shoplist();
        app.Formdata.get('/openapi/express/wechatapplet/express/advert/queryByPosition', { advPosition: '4' }, (res) => {
            console.log(res)
            if (res.code == "0000") {
                this.setData({
                    'imgArr': res.data
                })
            }
        })
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
        this.getAddress();
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

    }
})