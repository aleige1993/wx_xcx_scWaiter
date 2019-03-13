// pages/memberInfo/modifyAddress/modify.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      id:'',
    showArea: false,
    selectedAreaCode: '500103',
    selectedAreaName:'',
    checked:false,
    values:'',
    flag:'',
    listItem:''
  },

  onSelect() {
    this.setData({
      showArea: true,
        selectedAreaCode: this.data.selectedAreaCode
    });
  },
    onChange(event) {
        this.setData({
            checked: event.detail
        });
    },
  onClose() {
    this.setData({
      showArea: false
    });
  },

  onConfirm(e) {
      console.log(e)
    this.onClose();
    let html =[];
    e.detail.detail.values.map((item)=>{
       html.push(item.name)
      })
    this.setData({
        values: e.detail.detail.values,
        selectedAreaName: html,
        selectedAreaCode: e.detail.detail.values[2].code
    })
  },
    formSubmit(e){
        let vuls = e.detail.value;
        let values = this.data.values;
        let listItem = this.data.listItem;
        if (!this.WxValidate.checkForm(e)) {
            const error = this.WxValidate.errorList[0];
            wx.showToast({
                title: error.msg,
                icon: 'none',
                duration: 2000
            })
            return false
        }
        let parma = {
            userName: vuls.userName,
            mobile: vuls.mobile,
            districtNo: values ? values[2].code : listItem.districtNo,
            districtName: values ? values[2].name : listItem.districtName,
            cityNo: values ? values[1].code : listItem.cityNo,
            cityName: values ? values[1].name : listItem.cityName,
            provinceNo: values ? values[0].code : listItem.provinceNo,
            provinceName: values ? values[0].name : listItem.provinceName,
            detailAddress: vuls.detailAddress,
            flag: this.data.checked ? '1' : '0'
        }
       if(this.data.id){
           parma.id = this.data.id;
           app.Formdata.post('/openapi/express/wechatapplet/express/userAddr/edit', parma, (res) => {
               if (res.code == '0000') {
                   wx.showToast({
                       title: '修改成功',
                   })
                   setTimeout(() => {
                       wx.navigateBack({
                           delta: 1
                       })
                   }, 2000)
               }
           })
       }else{
           app.Formdata.post('/openapi/express/wechatapplet/express/userAddr/add', parma, (res) => {
               if (res.code == '0000') {
                   wx.showToast({
                       title: '保存成功',
                   })
                   setTimeout(() => {
                       wx.navigateBack({
                           delta: 1
                       })
                   }, 2000)
               }
           })
       }
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      if (options.id){
          this.setData({
              id: options.id
          })
      }
    if(this.data.id){
        wx.setNavigationBarTitle({
            title: '修改地址'
        })
        app.Formdata.get('/openapi/express/wechatapplet/express/userAddr/detail', {'id':this.data.id}, (res)=>{
            if(res.code=='0000'){
                console.log(res);
                this.setData({
                    listItem: res.data,
                    selectedAreaCode: res.data.districtNo,
                    selectedAreaName: [res.data.provinceName, res.data.cityName, res.data.districtName],
                    checked: res.data.flag == '1' ? true : false
                })
            }
        })
    
    }
      this.initValidate();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
    initValidate() {
        const rules = {
            userName:{
                required: true
            },
            mobile: {
                required: true,
                tel: true
            },
            districtName: {
                required: true
            },
            detailAddress: {
                required: true
            }
        }

        const messages = {
            mobile: {
                required: "请输入手机号",
                tel: "请输入正确的手机号"
            },
            userName: {
                required: "姓名不能为空"
            },
            districtName: {
                required: "所在区域不能为空"
            },
            detailAddress: {
                required: "详细地址不能为空"
            }
        }
        // 创建实例对象 
        this.WxValidate = new app.WxValidate(rules, messages)
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