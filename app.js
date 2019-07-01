
//app.js
import WxValidate from '/utils/WxValidate.js';
App({
  onLaunch: function () {
      var Promis = require('/utils/wxPromisify.js');
      Promis.wxPromisify(wx.request)({
          method: 'GET',
          url: 'https://openapi.songchewang.com/openapi/common/versions/version/host',
          data: {
              'message': JSON.stringify({ "versionNo": 100 })
          },
          header: {
              'appId': '100006',
              'sign': 'sign'
          },
      }).then((res) => {
          let data = res.data;
          if (data.code == '0000') {
              console.log('OPEN_API', data.data[0])
              this.OPEN_API = data.data[0];
              this.Config = require('/config/index.js');
              this.Formdata = require('/utils/Formdata.js');
              this.globalData.employId = 1;
              if (this.employIdCallback) {
                  this.employIdCallback(1);
              }
          } else {
              wx.showToast({
                  title: data.message,
                  icon: 'none'
              })
          }
      });
      Promis.wxPromisify(wx.request)({
          method: 'GET',
          url: 'https://pos.songchexiaozhan.com/wxapp/config/version',
          data: {
              'message': JSON.stringify({ "version": '1.1.6' })
          },
          header: {
              'content-type': 'application/x-www-form-urlencoded',
          },
      }).then((res) => {
          let data = res.data;
          if (data.code == '0000') {
              console.log('domain', data.data.domain)
              this.OPEN_APIPHP = data.data.domain;
              this.ConfigPHP = require('/config/indexPHP.js');
              this.FormdataPHP = require('/utils/FormdataPHP.js');
              this.globalData.employId = 2;
              if (this.employIdCallback) {
                  this.employIdCallback(2);
              }
          } else {
              wx.showToast({
                  title: data.message,
                  icon: 'none'
              })
          }
      })
    //   this.Config = require('/config/index.js');
    //   this.Formdata = require('/utils/Formdata.js');
    // this.ConfigPHP = require('/config/indexPHP.js');
    // this.FormdataPHP = require('/utils/FormdataPHP.js');
    this.utils = require('/utils/util.js');
    this.Bezier = require('/utils/Bezier.js');
    this.UserLogin = require('/utils/UserLogin.js');
    //this.Http = require('/utils/http.js');
    this.Tools = require('/utils/Tools.js');
    this.Date = require('/utils/Date.js');
    this.WxValidate = WxValidate;
    this.utils.screenSize();
    this.utils.updateManager();
    let _this = this;
      wx.getSystemInfo({
          success: function (res) {
              _this.globalData.ww = res.windowWidth;
              _this.globalData.hh = res.windowHeight;
          }
      })
  },
  globalData: {
    token:null,
    employId:null,
    userInfo: null,
    goodShop:null,
    ww:null,
    hh:null,
    latitude:null,
    longitude:null,
    stationArr:null,
    stationSchool:null,
    stationRent:null,
    stationLaundry:null,
    stationMember:null,
    stationMall:null,
    canUseAddlist:null
  }
})