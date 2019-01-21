//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    banner: {
        imgUrls: [
            'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548386640&di=466e70e7237799a21cd250500d5fc6e0&imgtype=jpg&er=1&src=http%3A%2F%2Fpic1.win4000.com%2Fwallpaper%2F8%2F543797a594fe7.jpg',
            'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548386741&di=129d92bb474496f163ab73cd653a44de&imgtype=jpg&er=1&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2Ffaf42968817f1f52cc0f22bae3c3d6761d630c0b1a501-XvH11G_fw658',
            'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548386777&di=b8065cba980c34f48d08fb50db614872&imgtype=jpg&er=1&src=http%3A%2F%2Fseopic.699pic.com%2Fphoto%2F10029%2F9682.jpg_wh1200.jpg'
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
