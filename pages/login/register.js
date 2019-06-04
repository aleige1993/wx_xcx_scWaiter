// pages/login/register.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        checked:false,
        mobile:'',
        code:'',
        oldPaswd:'',
        newPaswd:'',
        isShow:true,
        tiemNum:60
    },
    onChange(e){
        console.log(e)
        this.setData({
            checked: e.detail
        });
    },
    onCaptcha(e){
        if (this.data.mobile==""){
            app.Tools.showToast('请输入手机号码');
            return false;
        }
        let  parms = {
            'mobile': this.data.mobile,
            'busiType':"0",
            "userType": "1"
        }
        app.Formdata.post('/openapi/members/express/sms/smsCaptcha', parms,(res)=>{
            if(res.code=='0000'){
                 app.Date.VerifCode(this, 'isShow', this.data.tiemNum)
            }
        })
    },
    getChange(e){
        this.setData({
            [e.target.dataset.name]: e.detail
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
    formSubmit(e){
        if (!this.WxValidate.checkForm(e)) {
            const error = this.WxValidate.errorList[0];
            wx.showToast({
                title: error.msg,
                icon: 'none',
                duration: 2000
            })
            return false
        }

        let parms = {
            account:this.data.mobile,
            verifyCode:this.data.code,
            code:'9',
            password:'123456'
        }
        app.Formdata.post('/openapi/common/user/login', parms, (res)=>{
            if (res.code == "0000") {
                app.UserLogin.set('userInfo', res.data);
                wx.showToast({
                    title: '登录成功！',
                    icon: 'success',
                    duration: 2000,
                    success: (rult) => {
                        setTimeout(()=>{
                            wx.switchTab({
                                url: '/pages/index/index',
                            })
                        },2000)
                    }
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.initValidate();
        console.log(this.data)  
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

    },
    initValidate() {
        const rules = {
            mobile: {
                required: true,
                tel: true
            },
            code: {
                required: true
            }
        }

        const messages = {
            mobile: {
                required: "请输入手机号",
                tel: "请输入正确的手机号"
            },
            code: {
                required: "请输入验证码"
            }
        }
        // 创建实例对象 
        this.WxValidate = new app.WxValidate(rules, messages)
    }

})