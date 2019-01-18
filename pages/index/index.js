//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    banner: {
      imgUrls: [
        'http://sit.fbs.songchejr.com/images/login-bg.png',
        'http://sit.fbs.songchejr.com/images/login-bg.png'
      ],
      indicatorDots: true,
      autoplay: true,
      interval: 5000,
      duration: 1000
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
    }
  },

  onReady: function () {
    // app.Formdata.post('/openapi/common/cms/banners', {}, (res) => {
    //   console.log(res);
    // });
  },

  onLoad: function () {

  }
})
