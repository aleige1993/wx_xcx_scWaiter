//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    isLogin: false,
    isShow: false,
    state:1,
    banner: {
      imgUrls: [
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548386640&di=466e70e7237799a21cd250500d5fc6e0&imgtype=jpg&er=1&src=http%3A%2F%2Fpic1.win4000.com%2Fwallpaper%2F8%2F543797a594fe7.jpg',
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548386741&di=129d92bb474496f163ab73cd653a44de&imgtype=jpg&er=1&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2Ffaf42968817f1f52cc0f22bae3c3d6761d630c0b1a501-XvH11G_fw658',
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548386777&di=b8065cba980c34f48d08fb50db614872&imgtype=jpg&er=1&src=http%3A%2F%2Fseopic.699pic.com%2Fphoto%2F10029%2F9682.jpg_wh1200.jpg'
      ],
      indicatorDots: true,
      autoplay: true,
      interval: 5000,
      duration: 1000,
    },
    headNews: {
      list: [{
        url: 'http://baidu.com',
        title: '不明白汽车尾标是啥意思？一分钟教你看懂不明白汽车尾标是啥意思？一分钟教你看懂'
      }, {
        url: 'http://baidu.com',
        title: '头条测试'
      }],
      autoplay: true,
      interval: 5000,
      duration: 1000
    },
    sreachForm: {
      page: 1,
      limit: app.Config.PAGE_SIZE,
      status: 1,
      expressNo: ''
    },
    expressList: []
  },

  loadExpressList() {
    let _this = this;
    // wx.showLoading({
    //   title: '加载中...',
    // });
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
        // setTimeout(function () {
        //   wx.hideLoading();
        // }, 500);
        setTimeout(function () {
          wx.stopPullDownRefresh();
        }, 1000);
      }
    })
  },

  onGotUserInfo(e) {
    let wxUserInfo = e.detail.userInfo
    if (wxUserInfo) {
      app.UserLogin.set('wxUserInfo', wxUserInfo);
      this.setData({
          state:2
      })
    //   wx.showToast({
    //     title: '授权成功',
    //     icon: 'success',
    //     duration: 2000
    //   })
    //   this.setData({
    //     isShow: false
    //   })
    }
  },
    onGetphonenum(e){
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    // success(e){

    // }
    this.setData({
        isShow: false
    })
},
  clickTost() {
    console.log(123)
    wx.showModal({
      content: '客官,我们正在建设敬请期待',
      showCancel: false,
      confirmText: '我知道了',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        }
      }
    })
  },
  onShow: function () {
    this.setData({
      isShow: !app.UserLogin.get('wxUserInfo'),
      isLogin: app.UserLogin.get('userInfo')
    })
    if (this.data.isLogin) {
      this.loadExpressList();
    }
  },

  onLoad: function () {

  },

  onReachBottom: function () {
    if (this.data.isLogin) {
      this.setData({
        "sreachForm.page": ++this.data.sreachForm.page
      })
      this.loadExpressList();
    }
  }
})
