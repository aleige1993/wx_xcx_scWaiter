// pages/shopMall/returnGoods/index.js
let app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goodid:'',
        orderno:'',
        goodInfo:null,
        typeInfo:null,
        typeIndex:'',
        amount:null,
        pay_fee:null
    },
    onChange(e){
        let _data = this.data;
        console.log(e.detail)
        console.log(_data.goodInfo.pay_fee)
        console.log(_data.goodInfo.pay_fee * e.detail)
       let payMoeny =  _data.goodInfo.pay_fee * e.detail
        this.setData({
            amount: e.detail,
           pay_fee:payMoeny
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    formSubmit(e){
        console.log('form发生了submit事件，携带数据为：', e.detail.value);
        let _this =  this;
        let _data = this.data;
        let amounts = '';
        if (_data.typeIndex == '') {
            app.Tools.showToast('请选择退货原因');
            return false;
        }
        if (e.detail.value.name == '' || e.detail.value.name == null){
            app.Tools.showToast('请输入联系人');
            return false;
        }
        if (!(/^1\d{10}$/.test(e.detail.value.ipone))) {
            app.Tools.showToast('请输入正确的手机号');
            return false;
        }
        if (_data.amount){
            amounts = _data.amount
        }else{
            amounts = _data.goodInfo.amount
        }
        let prems = {
            order_no: _data.orderno,
            good_id: _data.goodid,
            'type': _data.typeInfo[_data.typeIndex].key,
            amount: amounts,
            reason: e.detail.value.textarea,
            apply_name: e.detail.value.name,
            apply_phone: e.detail.value.ipone
        }
        console.log(prems)
        app.FormdataPHP.post('/wxapp/orders/refund',prems,(res)=>{
            if (res.code == '0000') {
                wx.showToast({
                    title: '申请成功',
                    success() {
                        setTimeout(() => {
                            wx.navigateBack({})
                        }, 1500)
                    }
                })
            }
        });
    },
    getRefundInfo(){
        let _data = this.data;
        let prems = {
            order_no: _data.orderno,
            good_id:_data.goodid
        }
        app.FormdataPHP.get('/wxapp/orders/refundInfo',prems,(res)=>{
            if(res.code == '0000' ) {
                let { good, type } = res.data;
                let payMoeny = good.pay_fee * good.amount
                this.setData({
                    goodInfo:good,
                    typeInfo:type,
                    pay_fee: payMoeny
                })
            }
        })
    }, 
 typeChange(e) {
        this.setData({
            'typeIndex': e.detail.value,
        })
    },
    onLoad: function (options) {
        console.log(options);
        if (options.orderno){
            this.setData({
                goodid: options.goodid,
                orderno: options.orderno
            },()=>{
                this.getRefundInfo();
            })
        }
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