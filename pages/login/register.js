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
            console.log(res);
            if(res.code=='0000'){
                // app.Date.VerifCode(this, 'isShow', this.data.tiemNum)
            }
        })
    },
    getMobile(e){
        this.setData({
            mobile: e.detail
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
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

    }
})