// pages/shopMall/addressList/addAddress.js
let app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        state:null,
        addressInfo:'',
        formInfo:{
            id:'',
            addName:'',
            addIpone:'',
            addAddress:'',
            addDetails:'',
            longitude:'',
            latitude:''
        }
    },
    //保存
    formSubmit(e) {
        app.Tools.getFormID(e); 
        let _data  = this.data;
        let { addName, addIpone, addDetails, addAddress } = e.detail.value;
        if (addName==''){
            app.Tools.showToast('姓名 不能为空');
            return false
        }
        if (!(/^1\d{10}$/.test(addIpone))) {
            app.Tools.showToast('手机号码格式不正确');
            return false
        }
        if (addAddress == '') {
            app.Tools.showToast('请选择所在区域');
            return false
        }
        if (addDetails == '') {
            app.Tools.showToast('请填写详细地址');
            return false
        }
        let parms = {
            id: _data.formInfo.id,
            phone: addIpone,
            name: addName,
            location: addAddress,
            address: addDetails,
            longitude: _data.formInfo.longitude,
            latitude: _data.formInfo.latitude
        }
        let url ='';
        if (this.data.state == 1){
            url ="/wxapp/address/add";
        }else{
            url = "/wxapp/address/save";
        }
        app.FormdataPHP.post(url, parms, (res) => {
            if (res.code == '0000') {
                console.log(res)
                wx.showToast({
                    title: this.data.state == 1 ? '保存成功' : '修改成功',
                    success() {
                      setTimeout(()=>{
                          wx.navigateBack({})
                      },1500)
                    }
                })

            }
        })
    },
    //选择定位
    openAddress(e) {
        let _this = this;
        wx.chooseLocation({
            success: (res) => {
                console.log(res)
                _this.setData({
                    'formInfo.addAddress': res.address,
                    'formInfo.longitude': res.longitude,
                    'formInfo.latitude': res.latitude
                })
            },
            fail: (err) => {
                wx.showToast({
                    title: '获取失败',
                    icon: 'none'
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.state){
            if (options.state == '1'){
                wx.setNavigationBarTitle({
                    title: '新建收货地址'
                })
                
            }else{
                wx.setNavigationBarTitle({
                    title: '修改收货地址'
                })
            }
            this.setData({
                state: options.state
            }) 
        }
        if (options.addInfo) { 
            let items = JSON.parse(options.addInfo);
            this.setData({
                'formInfo.id': items.id,
                'formInfo.addName': items.name,
                'formInfo.addIpone': items.phone ,
                'formInfo.addAddress': items.location ,
                'formInfo.addDetails': items.address ,
                'formInfo.longitude': items.longitude ,
                'formInfo.latitude': items.latitude
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