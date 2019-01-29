// pages/checkExpress/index.js
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sreachForm: {
      page: 1,
      limit: app.Config.PAGE_SIZE,
      status: 1,
      expressNo: ''
    },
    expressList: []
  },

  onSearch(e) {
    this.setData({
      'sreachForm.page': 1,
      'expressList': []
    })
    this.loadExpressList();
  },

  onChange(e) {
    this.setData({
      'sreachForm.expressNo': e.detail
    })
  },

  getIndex(e) {
    this.setData({
      'sreachForm.page': 1,
      'sreachForm.status': ++e.detail.index,
      'sreachForm.expressNo': '',
      'expressList': []
    })
    this.loadExpressList();
  },

  loadExpressList() {
    let _this = this;
    wx.showLoading({
      title: '加载中...',
    });
    app.Formdata.get('/openapi/express/wechatapplet/express/order/queryForUser', this.data.sreachForm, function (res) {
      if (res.success && res.success === 'true') {
        if (!res.data || !res.data.length) {
          if (_this.data.sreachForm.page > 1) {
            app.Tools.showToast('没有更多的数据了')
          }
        } else {
          _this.setData({
            expressList: _this.data.expressList.concat(res.data)
          })
        }
        setTimeout(function () {
          wx.hideLoading();
        }, 500);
        setTimeout(function () {
          wx.stopPullDownRefresh();
        }, 1000);
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadExpressList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let _this = this;
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          scrollHeight: res.windowHeight - 88 + 'px'
        })
      }
    })
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
    this.setData({
      "sreachForm.page": 1,
      'expressList': []
    })
    this.loadExpressList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      "sreachForm.page": ++ this.data.sreachForm.page
    })
    this.loadExpressList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})