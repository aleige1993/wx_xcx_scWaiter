// pages/memberInfo/modifyAddress/modify.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showArea: false,
    selectedAreaCode: ''
  },

  onSelect() {
    this.setData({
      showArea: true,
      selectedAreaCode: '500000,500200,500231'
    });
  },

  onClose() {
    this.setData({
      showArea: false
    });
  },

  onConfirm(e) {
    this.onClose();
    console.log(e.detail.detail.values);
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