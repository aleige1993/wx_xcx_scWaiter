// pages/usCenter/index.js
let app = getApp();
import Dialog from '../../ui-plugins/vant/dialog/dialog';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    isLogin: false,
    wxUserInfo: {}
  },

  loginout() {
    Dialog.confirm({
      title: '提示',
      message: '确定要退出当前账号？'
    }).then(() => {
      // on confirm
      app.UserLogin.remove('userInfo');
    app.UserLogin.remove('wxUserInfo');
    wx.switchTab({
      url: '/pages/index/index',
    })
  }).catch(() => {
      // on cancel
    });
  },

  onGotUserInfo(e) {
    let wxUserInfo = e.detail.userInfo
    if (wxUserInfo) {
      app.UserLogin.set('wxUserInfo', wxUserInfo);
      wx.showToast({
        title: '授权成功',
        icon: 'success',
        duration: 2000
      })
      this.setData({
        isShow: false
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    let wxInfo = app.UserLogin.get('wxUserInfo');
    let userInfo = app.UserLogin.get('userInfo');
    this.setData({
      isShow: !wxInfo,
      isLogin: userInfo
    })
    if (wxInfo) {
      this.setData({
        wxUserInfo: app.UserLogin.get('userInfo')
      })
    }
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